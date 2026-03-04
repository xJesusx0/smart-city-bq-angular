import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import {
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { RoleService } from '../../api/role.service';
import type { components } from '../../__gen__/api_v1';

type DbRole = components['schemas']['RoleWithModulesDTO'];

@Component({
  selector: 'app-delete-role-dialog',
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
  ],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        class="bg-background relative z-50 grid w-full max-w-[425px] gap-4 rounded-lg border p-6 shadow-lg mx-4"
      >
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Eliminar Rol</h3>
          <p hlmDialogDescription>
            ¿Estás seguro de que deseas eliminar el rol <strong>{{ role()?.name }}</strong
            >? Esta acción no se puede deshacer.
          </p>
        </hlm-dialog-header>

        <hlm-dialog-footer class="flex gap-2 justify-end">
          <button hlmBtn variant="outline" (click)="close.emit()">Cancelar</button>
          <button hlmBtn variant="destructive" [disabled]="isLoading()" (click)="onDelete()">
            {{ isLoading() ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </hlm-dialog-footer>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRoleDialogComponent {
  private roleService = inject(RoleService);

  role = input<DbRole | null>(null);
  close = output<void>();
  success = output<void>();

  isLoading = signal(false);

  async onDelete() {
    const r = this.role();
    if (!r || !r.id) return;

    this.isLoading.set(true);
    try {
      await this.roleService.deleteRole(r.id);
      this.success.emit();
      this.close.emit();
    } catch (e) {
      console.error('Error deleting role:', e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
