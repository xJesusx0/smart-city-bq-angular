import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmInputDirective } from '../../../lib/components/ui/input';
import { HlmLabelDirective } from '../../../lib/components/ui/label';
import { AuthService } from '../../../lib/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    ...HlmCardImports,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessage: string | null = null;

  // ✅ FormGroup tipado correctamente (ya no sale el error ngtsc 4111)
  loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    });
  }

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter valid credentials.';
      return;
    }

    this.loading = true;

    // ✅ CORRECTO: getRawValue() en vez de value
    const { email, password } = this.loginForm.getRawValue();

    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        // En un entorno real, esto vendría de una API
        this.authService.setUser({
          id: 1,
          name: 'Usuario de Prueba',
          email: 'test@example.com',
          active: true,
          identification: '12345678',
          must_change_password: false,
          roles: [{ id: 1, name: 'admin', description: 'Administrador', active: true }],
          modules: [
            { id: 1, name: 'Cámaras', path: '/cameras', icon: 'camera', active: true, description: 'Gestión de semáforos' },
            { id: 2, name: 'Reportes', path: '/reports', icon: 'file-text', active: true, description: 'Visualización de datos' },
            { id: 3, name: 'Admin', path: '/admin', icon: 'settings', active: true, description: 'Administración del sistema' }
          ]
        } as any);
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }

      this.loading = false;
    }, 1500);
  }

  onGoogleLogin(): void {
    this.loading = true;
    this.errorMessage = null;

    console.log('Initiating Google login...');

    setTimeout(() => {
      this.errorMessage = 'Google login not implemented yet.';
      this.loading = false;
    }, 1500);
  }
}