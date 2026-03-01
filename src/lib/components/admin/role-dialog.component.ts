import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { HlmInputDirective } from '../ui/input';
import { HlmLabelDirective } from '../ui/label';
import { RoleService } from '../../api/role.service';
import type { components } from '../../__gen__/api_v1';

type DbRole = components['schemas']['RoleWithModulesDTO'];

@Component({
  selector: 'app-role-dialog',
  imports: [
    ReactiveFormsModule,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmLabelDirective,
  ],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        class="bg-background relative z-50 grid w-full max-w-[425px] gap-4 rounded-lg border p-6 shadow-lg mx-4"
      >
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ role() ? 'Editar Rol' : 'Nuevo Rol' }}</h3>
          <p hlmDialogDescription>
            {{ role() ? 'Modifica los datos del rol.' : 'Completa los datos para el nuevo rol.' }}
          </p>
        </hlm-dialog-header>

        <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label hlmLabel for="name" class="text-right">Nombre</label>
            <input hlmInput id="name" formControlName="name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label hlmLabel for="description" class="text-right">Descripción</label>
            <input hlmInput id="description" formControlName="description" class="col-span-3" />
          </div>

          <hlm-dialog-footer>
            <button hlmBtn variant="outline" type="button" (click)="close.emit()">Cancelar</button>
            <button hlmBtn type="submit" [disabled]="roleForm.invalid || isLoading()">
              {{ isLoading() ? 'Guardando...' : 'Guardar' }}
            </button>
          </hlm-dialog-footer>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDialogComponent {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);

  role = input<DbRole | null>(null);
  close = output<void>();
  success = output<void>();

  isLoading = signal(false);

  roleForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  constructor() {
    const roleEffect = () => {
      const r = this.role();
      if (r) {
        this.roleForm.patchValue({
          name: r.name || '',
          description: r.description || '',
        });
      }
    };
  }

  async onSubmit() {
    if (this.roleForm.invalid) return;

    this.isLoading.set(true);
    try {
      const r = this.role();
      if (r) {
        await this.roleService.updateRole(r.id!, this.roleForm.value as any);
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
