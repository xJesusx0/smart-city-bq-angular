import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmInputDirective } from '../../../lib/components/ui/input';
import { HlmLabelDirective } from '../../../lib/components/ui/label';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    });
  }

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
        console.log('Login successful');
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