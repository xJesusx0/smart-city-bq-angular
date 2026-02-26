import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import {
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { UserService } from '../../api/user.service';
import type { components } from '../../__gen__/api_v1';
import { toast } from 'ngx-sonner';

type UserWithRoles = components['schemas']['UserWithRolesDTO'];

@Component({
  selector: 'app-delete-user-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
  ],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-background relative z-50 grid w-full max-w-[425px] gap-4 rounded-lg border p-6 shadow-lg mx-4">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Eliminar Usuario</h3>
        <p hlmDialogDescription>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{{ user()?.name }}</strong
          >? Esta acción no se puede deshacer.
        </p>
      </hlm-dialog-header>

      <hlm-dialog-footer class="flex gap-2 justify-end">
        <button hlmBtn variant="outline" (click)="close.emit()" [disabled]="isLoading()">
          Cancelar
        </button>
        <button hlmBtn variant="destructive" [disabled]="isLoading()" (click)="onDelete()">
          {{ isLoading() ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </hlm-dialog-footer>
    </div>
    </div>
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
    const userToDelete = this.user();
    if (!userToDelete) return;

    this.isLoading.set(true);

    try {
      await this.userService.deleteUser(userToDelete.id!);
      toast.success('Usuario eliminado con éxito');
      this.success.emit();
      this.close.emit();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Ocurrió un error al eliminar el usuario.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
