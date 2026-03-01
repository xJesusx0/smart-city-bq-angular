import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  inject,
  effect,
  OnInit,
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
import { UserService } from '../../api/user.service';
import { RoleService } from '../../api/role.service';
import type { components } from '../../__gen__/api_v1';
import { toast } from 'ngx-sonner';

type UserUpdate = components['schemas']['UserUpdate'];
type UserCreate = components['schemas']['UserCreate'];
type UserWithRoles = components['schemas']['UserWithRolesDTO'];
type Role = components['schemas']['RoleBase'];

@Component({
  selector: 'app-user-dialog',
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
          <h3 hlmDialogTitle class="text-2xl">
            {{ user() ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
          </h3>
          <p hlmDialogDescription>
            {{
              user()
                ? 'Actualiza los datos personales y roles asignados.'
                : 'Registra un nuevo usuario y asígnale sus responsabilidades.'
            }}
          </p>
        </hlm-dialog-header>

        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Columna Izquierda: Identidad -->
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <label hlmLabel for="name" class="font-semibold">Nombre Completo</label>
                <input hlmInput id="name" formControlName="name" placeholder="Ej: Juan Pérez" />
              </div>
              <div class="flex flex-col gap-2">
                <label hlmLabel for="email" class="font-semibold">Correo Electrónico</label>
                <input
                  hlmInput
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="juan.perez@smartcity.com"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label hlmLabel for="identification" class="font-semibold"
                  >Identificación / DNI</label
                >
                <input
                  hlmInput
                  id="identification"
                  formControlName="identification"
                  placeholder="Ej: 123456789"
                  [readonly]="!!user()"
                  [class.opacity-60]="!!user()"
                />
                @if (user()) {
                  <p class="text-[10px] text-muted-foreground px-1 italic">
                    * La identificación no puede ser modificada.
                  </p>
                }
              </div>
            </div>

            <!-- Columna Derecha: Roles -->
            <div class="flex flex-col gap-2">
              <label hlmLabel class="font-semibold">Roles Asignados</label>
              <div
                class="h-[250px] overflow-y-auto w-full rounded-md border p-4 bg-muted/30 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              >
                <div class="space-y-3">
                  @if (isLoadingRoles()) {
                    <div class="flex items-center justify-center h-full py-10">
                      <p class="text-muted-foreground animate-pulse text-sm">
                        Cargando roles disponibles...
                      </p>
                    </div>
                  } @else {
                    @for (role of availableRoles(); track role.id) {
                      <label
                        class="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          [checked]="isRoleSelected(role.id!)"
                          (change)="toggleRole(role.id!)"
                          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div class="flex flex-col">
                          <span class="font-medium group-hover:text-primary transition-colors">{{
                            role.name
                          }}</span>
                          <span class="text-xs text-muted-foreground leading-tight">{{
                            role.description || 'Permisos de ' + role.name
                          }}</span>
                        </div>
                      </label>
                    } @empty {
                      <div
                        class="flex flex-col items-center justify-center h-full py-10 text-center"
                      >
                        <p class="text-sm text-muted-foreground">
                          No hay roles activos en el sistema.
                        </p>
                      </div>
                    }
                  }
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-1 px-1">
                Un usuario puede tener uno o múltiples roles simultáneamente.
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
            <button hlmBtn type="submit" [disabled]="userForm.invalid || isLoading()">
              {{ isLoading() ? 'Guardando...' : user() ? 'Guardar Cambios' : 'Crear Usuario' }}
            </button>
          </hlm-dialog-footer>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private roleService = inject(RoleService);

  user = input<UserWithRoles | null>(null);
  close = output<void>();
  success = output<void>();

  isLoading = signal(false);
  isLoadingRoles = signal(false);
  availableRoles = signal<Role[]>([]);
  selectedRoleIds = signal<number[]>([]);

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    identification: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.userForm.patchValue({
          name: u.name || '',
          email: u.email || '',
          identification: u.identification || '',
        });
        this.selectedRoleIds.set(u.roles?.map((r) => r.id!) || []);
      } else {
        this.userForm.reset();
        this.selectedRoleIds.set([]);
      }
    });
  }

  async ngOnInit() {
    await this.loadRoles();
  }

  async loadRoles() {
    this.isLoadingRoles.set(true);
    try {
      const allRoles = await this.roleService.getRoles({ active: true });
      this.availableRoles.set(allRoles);
    } catch (e) {
      toast.error('No se pudieron cargar los roles.');
    } finally {
      this.isLoadingRoles.set(false);
    }
  }

  isRoleSelected(id: number) {
    return this.selectedRoleIds().includes(id);
  }

  toggleRole(id: number) {
    const current = this.selectedRoleIds();
    if (current.includes(id)) {
      this.selectedRoleIds.set(current.filter((i) => i !== id));
    } else {
      this.selectedRoleIds.set([...current, id]);
    }
  }

  async onSubmit() {
    if (this.userForm.invalid) return;

    this.isLoading.set(true);

    const formValue = this.userForm.value;
    const selectedRoles = this.selectedRoleIds();

    try {
      const currentUser = this.user();
      if (currentUser) {
        const payload: UserUpdate = {
          name: formValue.name!,
          email: formValue.email!,
          roles: selectedRoles,
        };
        await this.userService.updateUser(currentUser.id!, payload);
        toast.success('Usuario actualizado con éxito');
      } else {
        const payload: UserCreate = {
          name: formValue.name!,
          email: formValue.email!,
          identification: formValue.identification!,
          roles: selectedRoles,
          active: true,
          external_login: false,
          must_change_password: true,
        };
        await this.userService.createUser(payload);
        toast.success('Usuario creado con éxito');
      }
      this.success.emit();
      this.close.emit();
    } catch (e: any) {
      console.error('Error saving user:', e);
      toast.error(e.message || 'Ocurrió un error al guardar el usuario.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
