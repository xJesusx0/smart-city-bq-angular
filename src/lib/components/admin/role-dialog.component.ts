import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  inject,
  effect,
} from '@angular/core';
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
type ModuleBase = components['schemas']['ModuleBase'];

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
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        class="bg-background relative z-50 grid w-full max-w-[800px] gap-4 rounded-lg border p-6 shadow-xl mx-4"
      >
        <hlm-dialog-header>
          <h3 hlmDialogTitle class="text-2xl">{{ role() ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h3>
          <p hlmDialogDescription>
            {{
              role()
                ? 'Actualiza los permisos y detalles del rol.'
                : 'Define el nombre y los accesos para el nuevo rol administrativo.'
            }}
          </p>
        </hlm-dialog-header>

        <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Columna Izquierda: Identidad -->
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <label hlmLabel for="name" class="font-semibold">Nombre del Rol</label>
                <input
                  hlmInput
                  id="name"
                  formControlName="name"
                  placeholder="Ej: Supervisor de Tráfico"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label hlmLabel for="description" class="font-semibold">Descripción</label>
                <textarea
                  hlmInput
                  id="description"
                  formControlName="description"
                  rows="4"
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none text-foreground"
                  placeholder="Explica qué responsabilidades tiene este rol..."
                ></textarea>
              </div>
            </div>

            <!-- Columna Derecha: Módulos -->
            <div class="flex flex-col gap-2">
              <label hlmLabel class="font-semibold">Módulos y Accesos</label>
              <div
                class="h-[250px] overflow-y-auto w-full rounded-md border p-4 bg-muted/30 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              >
                <div class="space-y-3">
                  @if (isLoadingModules()) {
                    <div class="flex items-center justify-center h-full py-10">
                      <p class="text-muted-foreground animate-pulse">Cargando módulos...</p>
                    </div>
                  } @else {
                    @for (mod of availableModules(); track mod.id) {
                      <label
                        class="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          [checked]="isModuleSelected(mod.id!)"
                          (change)="toggleModule(mod.id!)"
                          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div class="flex flex-col">
                          <span class="font-medium group-hover:text-primary transition-colors">{{
                            mod.name
                          }}</span>
                          <span class="text-xs text-muted-foreground leading-tight">{{
                            mod.description || 'Acceso al módulo de ' + mod.name
                          }}</span>
                        </div>
                      </label>
                    }
                  }
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-1 px-1">
                Selecciona los módulos a los que este rol tendrá permiso de ingreso.
              </p>
            </div>
          </div>

          <hlm-dialog-footer class="border-t pt-4">
            <button
              hlmBtn
              variant="outline"
              type="button"
              (click)="close.emit()"
              [disabled]="isLoading()"
            >
              Cancelar
            </button>
            <button hlmBtn type="submit" [disabled]="roleForm.invalid || isLoading()">
              {{ isLoading() ? 'Guardando cambios...' : role() ? 'Guardar Cambios' : 'Crear Rol' }}
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
  isLoadingModules = signal(false);
  availableModules = signal<ModuleBase[]>([]);
  selectedModuleIds = signal<number[]>([]);

  roleForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
  });

  constructor() {
    this.loadModules();

    effect(() => {
      const r = this.role();
      if (r) {
        this.roleForm.patchValue({
          name: r.name || '',
          description: r.description || '',
        });
        this.selectedModuleIds.set(r.modules?.map((m) => m.id!) || []);
      } else {
        this.roleForm.reset();
        this.selectedModuleIds.set([]);
      }
    });
  }

  async loadModules() {
    this.isLoadingModules.set(true);
    try {
      const mods = await this.roleService.getModules({ active: true });
      this.availableModules.set(mods);
    } catch (e) {
      console.error('Error loading modules:', e);
    } finally {
      this.isLoadingModules.set(false);
    }
  }

  isModuleSelected(id: number) {
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

  async onSubmit() {
    if (this.roleForm.invalid) return;

    this.isLoading.set(true);
    try {
      const formValue = this.roleForm.value;
      const roleData: any = {
        name: formValue.name!,
        description: formValue.description || '',
        modules: this.selectedModuleIds(),
        active: true,
      };

      const r = this.role();
      if (r) {
        await this.roleService.updateRole(r.id!, roleData);
      } else {
        await this.roleService.createRole(roleData);
      }

      this.success.emit();
      this.close.emit();
    } catch (e: any) {
      console.error('Error saving role:', e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
