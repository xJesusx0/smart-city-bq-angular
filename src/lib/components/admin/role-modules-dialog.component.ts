import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HlmDialogContentComponent,
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { HlmLabelDirective } from '../ui/label';
import { RoleService } from '../../api/role.service';
import type { components } from '../../__gen__/api_v1';

type DbRole = components['schemas']['RoleWithModulesDTO'];

@Component({
  selector: 'app-role-modules-dialog',
  standalone: true,
  imports: [
    CommonModule,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
    HlmLabelDirective,
  ],
  template: `
    <hlm-dialog-content class="sm:max-w-[500px]">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Módulos del Rol: {{ role()?.name }}</h3>
        <p hlmDialogDescription>Gestiona los módulos a los que este rol tiene acceso.</p>
      </hlm-dialog-header>

      <div class="py-4 space-y-4">
        <div class="space-y-2">
          @for (mod of modules; track mod.id) {
            <label
              hlmLabel
              class="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
            >
              <input
                type="checkbox"
                [checked]="hasModule(mod.id)"
                (change)="toggleModule(mod.id)"
              />
              <span>{{ mod.name }}</span>
            </label>
          }
        </div>
      </div>

      <hlm-dialog-footer class="flex gap-2 justify-end">
        <button hlmBtn variant="outline" (click)="close.emit()">Cerrar</button>
        <button hlmBtn [disabled]="isLoading()" (click)="onSave()">
          {{ isLoading() ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </hlm-dialog-footer>
    </hlm-dialog-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleModulesDialogComponent {
  private roleService = inject(RoleService);

  role = input<DbRole | null>(null);
  close = output<void>();
  success = output<void>();

  isLoading = signal(false);

  // Mock modules
  modules = [
    { id: 1, name: 'Cámaras' },
    { id: 2, name: 'Reportes' },
    { id: 3, name: 'Admin' },
  ];

  selectedModuleIds = signal<number[]>([]);

  constructor() {
    // Fill selected modules if role is provided
    const roleEffect = () => {
      const r = this.role();
      if (r) {
        this.selectedModuleIds.set(r.modules?.map((m) => m.id!) || []);
      }
    };
  }

  hasModule(id: number) {
    return this.selectedModuleIds().includes(id);
  }

  toggleModule(id: number) {
    const current = this.selectedModuleIds();
    if (current.includes(id)) {
      this.selectedModuleIds.set(current.filter((i) => i !== id));
    } else {
      this.selectedModuleIds.set([...current, id]);
    }
  }

  async onSave() {
    const r = this.role();
    if (!r) return;

    this.isLoading.set(true);
    try {
      this.success.emit();
      this.close.emit();
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
