import { Injectable, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map } from 'rxjs';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { ApiService } from '../api/api.service';
import { AuthService } from './auth.service';
import { deleteCookie, setCookie } from '../api/helpers';
import { TOKEN_KEY, GOOGLE_CLIENT_ID } from '../api/const';
import type { components } from '../__gen__/api_v1';
import { Router } from '@angular/router';

type LoginBody = components['schemas']['Body_login_api_auth_login_post'];
type OauthTokenRequest = components['schemas']['OauthTokenRequest'];
type Token = components['schemas']['Token'];
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
  private msalBroadcastService = inject(MsalBroadcastService);

  readonly isMicrosoftBackendProcessing = signal(false);

  readonly isMsalInProgress = toSignal(
    this.msalBroadcastService.inProgress$.pipe(
      map(
        (status) =>
          status === InteractionStatus.HandleRedirect || status === InteractionStatus.AcquireToken,
      ),
    ),
    { initialValue: false },
  );

  readonly isMicrosoftPending = computed(
    () => this.isMsalInProgress() || this.isMicrosoftBackendProcessing(),
  );

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
    const body: OauthTokenRequest = { token };
    const { data, error, response } = await this.api.client.POST('/api/auth/login/google', { body });

    if (error || !response?.ok) {
      console.error('Error detallado del servidor al validar con Google:', error);
      throw new Error('Login con Google fallido. El servidor rechazó la autenticación.');
    }

    const accessToken = data?.access_token;
    if (accessToken) {
      setCookie(TOKEN_KEY, accessToken);
      await this.loadCurrentUser();
      this.router.navigate(['/app/home']);
    }
  }

  /**
   * Initiates Microsoft login via redirect.
   * The browser navigates to Microsoft's login page.
   * After auth, the user is redirected back and
   * handleMicrosoftRedirectResult() is called from app.ts.
   */
  async loginWithMicrosoft(): Promise<void> {
    await firstValueFrom(this.msalService.loginRedirect({ scopes: ['User.Read'] }));
  }

  /**
   * Called from app.ts after the user returns from Microsoft login.
   * Sends the idToken to the backend to exchange for an app JWT.
   */
  async handleMicrosoftRedirectResult(idToken: string): Promise<void> {
    this.isMicrosoftBackendProcessing.set(true);
    try {
      const body: OauthTokenRequest = { token: idToken };
      const { data, error } = await this.api.client.POST('/api/auth/login/microsoft', {
        body,
      });

      if (error) {
        throw new Error('Login con Microsoft fallido.');
      }

      const tokenResponse = data as Token | undefined;
      const accessToken = tokenResponse?.access_token;
      if (accessToken) {
        setCookie(TOKEN_KEY, accessToken);
        await this.loadCurrentUser();
        this.router.navigate(['/app/home']);
      }
    } finally {
      this.isMicrosoftBackendProcessing.set(false);
    }
  }

  /**
   * Logout: clear cookie, clear user state, navigate to login.
   * If logged in via Microsoft, also logs out from Entra ID.
   */
  async logout(): Promise<void> {
    const msalAccount = this.msalService.instance.getActiveAccount();

    deleteCookie(TOKEN_KEY);
    this.authService.clearUser();

    if (msalAccount) {
      // Redirect to Microsoft logout, then back to /login
      await firstValueFrom(
        this.msalService.logoutRedirect({
          account: msalAccount,
          postLogoutRedirectUri: `${window.location.origin}/login`,
        }),
      );
    } else {
      this.router.navigate(['/login']);
    }
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
