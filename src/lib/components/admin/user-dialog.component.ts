import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { HlmInputDirective } from '../ui/input';
import { HlmLabelDirective } from '../ui/label';
import { UserService } from '../../api/user.service';
import type { components } from '../../__gen__/api_v1';

type UserUpdate = components['schemas']['UserUpdate'];
type UserWithRoles = components['schemas']['UserWithRolesDTO'];

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmLabelDirective,
  ],
  template: `
    <hlm-dialog-content class="sm:max-w-[425px]">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>{{ user() ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
        <p hlmDialogDescription>
          {{
            user() ? 'Modifica los datos del usuario.' : 'Completa los datos para el nuevo usuario.'
          }}
        </p>
      </hlm-dialog-header>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <label hlmLabel for="name" class="text-right">Nombre</label>
          <input hlmInput id="name" formControlName="name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <label hlmLabel for="email" class="text-right">Email</label>
          <input hlmInput id="email" type="email" formControlName="email" class="col-span-3" />
        </div>

        <hlm-dialog-footer>
          <button hlmBtn variant="outline" type="button" (click)="close.emit()">Cancelar</button>
          <button hlmBtn type="submit" [disabled]="userForm.invalid || isLoading()">
            {{ isLoading() ? 'Guardando...' : 'Guardar' }}
          </button>
        </hlm-dialog-footer>
      </form>
    </hlm-dialog-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  user = input<UserWithRoles | null>(null);
  close = output<void>();
  success = output<void>();

  isLoading = signal(false);

  userForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    // Fill form if user is provided
    const userEffect = () => {
      const u = this.user();
      if (u) {
        this.userForm.patchValue({
          name: u.name || '',
          email: u.email || '',
        });
      }
    };
  }

  async onSubmit() {
    if (this.userForm.invalid) return;

    this.isLoading.set(true);
    try {
      const u = this.user();
      if (u) {
        await this.userService.updateUser(u.id!, this.userForm.value as any);
      }
      this.success.emit();
      this.close.emit();
    } catch (e: any) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
