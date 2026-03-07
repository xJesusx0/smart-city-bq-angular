import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthQueryService } from '../../../lib/auth/auth-query.service';
import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmInputDirective } from '../../../lib/components/ui/input';
import { HlmLabelDirective } from '../../../lib/components/ui/label';
import { LucideAngularModule, Loader } from 'lucide-angular';
import { GOOGLE_CLIENT_ID } from '../../../lib/api/const';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: Record<string, unknown>): void;
          renderButton(element: HTMLElement, options: Record<string, unknown>): void;
          prompt(): void;
        };
      };
    };
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...HlmCardImports,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    LucideAngularModule,
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authQuery = inject(AuthQueryService);

  readonly LoaderIcon = Loader;
  readonly googleClientId = GOOGLE_CLIENT_ID;

  readonly isPending = signal(false);
  readonly isGooglePending = signal(false);
  readonly isMicrosoftPending = this.authQuery.isMicrosoftPending;
  readonly errorMessage = signal<string | null>(null);

  readonly googleButtonContainer = viewChild<ElementRef<HTMLDivElement>>('googleContainer');

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  private googleScript: HTMLScriptElement | null = null;

  ngOnInit(): void {
    this.loadGoogleScript();
  }

  ngOnDestroy(): void {
    this.googleScript?.remove();
  }

  private loadGoogleScript(): void {
    if (!this.googleClientId) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initGoogleSignIn();
    document.head.appendChild(script);
    this.googleScript = script;
  }

  private initGoogleSignIn(): void {
    const container = this.googleButtonContainer()?.nativeElement;
    if (!window.google || !container) return;

    window.google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: { credential: string }) => this.handleGoogleCredential(response),
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Renderizamos el botón de Google para que sea lo más grande posible
    window.google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 400,
    });
  }

  private async handleGoogleCredential(response: { credential: string }): Promise<void> {
    this.isGooglePending.set(true);
    this.errorMessage.set(null);
    try {
      await this.authQuery.loginWithGoogle(response.credential);
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Google login fallido.');
    } finally {
      this.isGooglePending.set(false);
    }
  }

  async handleMicrosoftLogin(): Promise<void> {
    this.errorMessage.set(null);
    try {
      await this.authQuery.loginWithMicrosoft();
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Login con Microsoft fallido.');
    }
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set(null);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isPending.set(true);
    try {
      const { username, password } = this.loginForm.getRawValue();
      await this.authQuery.login({
        username,
        password,
        scope: 'login',
        grant_type: 'password',
        client_id: null,
        client_secret: null,
      });
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Login fallido.');
    } finally {
      this.isPending.set(false);
    }
  }
}
