import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmDialogContentComponent, HlmDialogHeaderComponent, HlmDialogFooterComponent, HlmDialogTitleDirective, HlmDialogDescriptionDirective } from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { UserService } from '../../api/user.service';
import type { components } from '../../__gen__/api_v1';

type UserWithRoles = components['schemas']['UserWithRolesDTO'];

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
  ],
  template: `
    <hlm-dialog-content class="sm:max-w-[425px]">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Eliminar Usuario</h3>
        <p hlmDialogDescription>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{{ user()?.name }}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </hlm-dialog-header>

      <hlm-dialog-footer class="flex gap-2 justify-end">
        <button hlmBtn variant="outline" (click)="close.emit()">Cancelar</button>
        <button hlmBtn variant="destructive" [disabled]="isLoading()" (click)="onDelete()">
          {{ isLoading() ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </hlm-dialog-footer>
    </hlm-dialog-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteUserDialogComponent {
  private userService = inject(UserService);

  user = input<UserWithRoles | null>(null);
  close = output<void>();
  success = output<void>();

  isLoading = signal(false);

  async onDelete() {
    this.success.emit();
    this.close.emit();
  }
}
