import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmInputDirective } from '../../../lib/components/ui/input';
import { HlmLabelDirective } from '../../../lib/components/ui/label';
import { AuthQueryService } from '../../../lib/auth/auth-query.service';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmNewPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonDirective,
    ...HlmCardImports,
    HlmInputDirective,
    HlmLabelDirective,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authQuery = inject(AuthQueryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // ✅ FormGroup tipado correctamente
  changePasswordForm!: FormGroup<{
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmNewPassword: FormControl<string>;
  }>;

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: this.fb.nonNullable.control('', [Validators.required]),
        newPassword: this.fb.nonNullable.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmNewPassword: this.fb.nonNullable.control('', [Validators.required]),
      },
      { validators: passwordMatchValidator() },
    );
  }

  async onSubmit(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.errorMessage.set('Por favor corrija los errores en el formulario.');
      this.loading.set(false);
      return;
    }

    try {
      const { currentPassword, newPassword } = this.changePasswordForm.getRawValue();

      await this.authQuery.changePassword({
        token: this.route.snapshot.queryParamMap.get('token') || '',
        password: newPassword,
      });

      this.successMessage.set('Contraseña cambiada exitosamente!');
      this.changePasswordForm.reset();

      // Redirigir al home después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/app/home']);
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al cambiar la contraseña.';
      this.errorMessage.set(errorMsg);
      this.loading.set(false);
    }
  }
}
