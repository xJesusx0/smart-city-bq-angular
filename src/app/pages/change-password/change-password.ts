import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmInputDirective } from '../../../lib/components/ui/input';
import { HlmLabelDirective } from '../../../lib/components/ui/label';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmButtonDirective,
    ...HlmCardImports,
    HlmInputDirective,
    HlmLabelDirective,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // ✅ FormGroup tipado correctamente
  changePasswordForm!: FormGroup<{
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmNewPassword: FormControl<string>;
  }>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: this.fb.nonNullable.control('', [Validators.required]),
        newPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
        confirmNewPassword: this.fb.nonNullable.control('', [Validators.required]),
      },
      { validators: passwordMatchValidator() }
    );
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.errorMessage = 'Please correct the errors in the form.';
      this.loading = false;
      return;
    }

    // ✅ CORREGIDO: usar getRawValue() en vez de value
    const { currentPassword, newPassword } = this.changePasswordForm.getRawValue();

    // Simulate API call
    setTimeout(() => {
      if (currentPassword === 'old_password' && newPassword === 'new_password') {
        this.successMessage = 'Password changed successfully!';
        this.changePasswordForm.reset();
      } else {
        this.errorMessage = 'Failed to change password. Please check your current password.';
      }
      this.loading = false;
    }, 1500);
  }
}