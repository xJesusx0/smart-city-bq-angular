import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { ApiService } from '../api/api.service';
import { AuthService } from './auth.service';
import { deleteCookie, setCookie } from '../api/helpers';
import { TOKEN_KEY, GOOGLE_CLIENT_ID } from '../api/const';
import type { components } from '../__gen__/api_v1';
import { Router } from '@angular/router';

type LoginBody = components['schemas']['Body_login_api_auth_login_post'];
type GoogleTokenRequest = components['schemas']['GoogleTokenRequest'];
type ChangePasswordDTO = components['schemas']['ChangePasswordDTO'];

/**
 * Auth Query Service - handles all auth API calls
 * Provides mutations and queries equivalent to Svelte's query/auth.ts
 */
@Injectable({ providedIn: 'root' })
export class AuthQueryService {
    private api = inject(ApiService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private msalService = inject(MsalService);

    readonly googleClientId = GOOGLE_CLIENT_ID;

    /**
     * Load the current user from the API and set in AuthService.
     * Called as an app initializer, so the guard knows if we're authenticated.
     */
    async loadCurrentUser(): Promise<void> {
        try {
            const { data } = await this.api.client.GET('/api/auth/me');
            if (data) {
                this.authService.setUser(data);
            }
        } catch {
            // Not authenticated – that's fine, guard will redirect to /login
        }
    }

    /**
     * Login with username/password
     */
    async login(body: LoginBody): Promise<void> {
        const { data, error, response } = await this.api.authClient.POST('/api/auth/login', { body });

        if (error || !response?.ok) {
            let msg = 'Login fallido. Verifica tus credenciales.';
            try {
                if (response) {
                    const text = await response.text();
                    if (text) msg += ` Detalle servidor: ${text}`;
                }
            } catch {
                // ignore
            }
            throw new Error(msg);
        }

        const token = data?.access_token;
        if (token) {
            setCookie(TOKEN_KEY, token);
            await this.loadCurrentUser();
            this.router.navigate(['/app/home']);
        }
    }

    /**
     * Login with Google OAuth token
     */
    async loginWithGoogle(token: string): Promise<void> {
        const body: GoogleTokenRequest = { token };
        const { data, error } = await this.api.client.POST('/api/auth/login/google', { body });

        if (error) {
            throw new Error('Login con Google fallido.');
        }

        const accessToken = data?.access_token;
        if (accessToken) {
            setCookie(TOKEN_KEY, accessToken);
            await this.loadCurrentUser();
            this.router.navigate(['/app/home']);
        }
    }

    /**
     * Login with Microsoft Entra ID (Azure AD) via MSAL popup.
     *
     * Flow:
     * 1. Opens Microsoft login popup
     * 2. Receives the idToken from Microsoft
     * 3. Sends idToken to backend API to exchange for app JWT
     * 4. Stores JWT and loads user profile
     */
    async loginWithMicrosoft(): Promise<void> {
        const result = await firstValueFrom(
            this.msalService.loginPopup({ scopes: ['User.Read'] }),
        );

        if (!result?.idToken) {
            throw new Error('No se recibió token de Microsoft.');
        }

        // Send Microsoft idToken to backend to exchange for app JWT
        const { data, error } = await this.api.client.POST('/api/auth/login/microsoft' as any, {
            body: { token: result.idToken } as any,
        });

        if (error) {
            throw new Error('Login con Microsoft fallido.');
        }

        const accessToken = (data as any)?.access_token;
        if (accessToken) {
            setCookie(TOKEN_KEY, accessToken);
            await this.loadCurrentUser();
            this.router.navigate(['/app/home']);
        }
    }

    /**
     * Logout: clear cookie, clear user state, navigate to login
     */
    async logout(): Promise<void> {
        // If there's an active MSAL account, also log out from Microsoft
        const msalAccount = this.msalService.instance.getActiveAccount();
        if (msalAccount) {
            await firstValueFrom(this.msalService.logoutPopup({
                account: msalAccount,
                mainWindowRedirectUri: '/login',
            }));
        }

        deleteCookie(TOKEN_KEY);
        this.authService.clearUser();
        this.router.navigate(['/login']);
    }

    /**
     * Change password
     */
    async changePassword(body: ChangePasswordDTO): Promise<void> {
        const { data, error, response } = await this.api.client.POST('/api/auth/change-password', {
            body,
        });

        if (error || !response.ok) {
            throw new Error('Error al cambiar la contraseña.');
        }

        const token = data?.access_token;
        if (token) {
            setCookie(TOKEN_KEY, token);
        }
    }
}
