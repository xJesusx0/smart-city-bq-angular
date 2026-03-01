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
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
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
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-background relative z-50 grid w-full max-w-[525px] gap-4 rounded-lg border p-6 shadow-lg mx-4">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>{{ user() ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
        <p hlmDialogDescription>
          {{
            user()
              ? 'Modifica los datos del usuario y sus roles.'
              : 'Completa los datos para el nuevo usuario.'
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
        <div class="grid grid-cols-4 items-center gap-4">
          <label hlmLabel for="identification" class="text-right">Identificación</label>
          <input hlmInput id="identification" formControlName="identification" class="col-span-3" />
        </div>

        <div class="grid gap-2">
          <label hlmLabel>Roles</label>
            @if (roles().length > 0) {
          <div
            class="grid grid-cols-2 gap-2 rounded-md border p-4"
            formArrayName="roles"
          >
            @for (role of roles(); track role.id; let i = $index) {
              <label class="flex items-center gap-2 font-normal">
                <input
                  type="checkbox"
                  [formControlName]="i"
                  class="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                />
                <span>{{ role.name }}</span>
              </label>
            }
          </div>
          } @else {
            <p class="text-sm text-muted-foreground">No hay roles disponibles.</p>
          }
        </div>

        <hlm-dialog-footer>
          <button hlmBtn variant="outline" type="button" (click)="close.emit()">Cancelar</button>
          <button hlmBtn type="submit" [disabled]="userForm.invalid || isLoading()">
            {{ isLoading() ? 'Guardando...' : 'Guardar' }}
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
  roles = signal<Role[]>([]);

  userForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    identification: ['', [Validators.required]],
    roles: this.fb.array<boolean>([]),
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
        this.updateRolesCheckboxes(u.roles.map((r) => r.id!));
      } else {
        this.userForm.reset();
      }
    });
  }

  async ngOnInit() {
    try {
      const allRoles = await this.roleService.getRoles({ active: true });
      this.roles.set(allRoles);
      this.buildRolesCheckboxes();
    } catch (e) {
      toast.error('No se pudieron cargar los roles. Intente de nuevo.');
    }
  }

  get rolesFormArray() {
    return this.userForm.get('roles') as FormArray;
  }

  private buildRolesCheckboxes() {
    this.rolesFormArray.clear();
    this.roles().forEach(() => this.rolesFormArray.push(this.fb.control(false)));
    this.updateRolesCheckboxes(this.user()?.roles.map((r) => r.id!) || []);
  }

  private updateRolesCheckboxes(userRoleIds: number[]) {
    this.rolesFormArray.controls.forEach((control, index) => {
      const role = this.roles()[index];
      control.setValue(userRoleIds.includes(role.id!));
    });
  }

  private getSelectedRoleIds(): number[] {
    return this.roles()
      .filter((_, i) => this.rolesFormArray.at(i).value)
      .map((role) => role.id!);
  }

  async onSubmit() {
    if (this.userForm.invalid) return;

    this.isLoading.set(true);

    const formValue = this.userForm.value;
    const selectedRoles = this.getSelectedRoleIds();

    try {
      const currentUser = this.user();
      if (currentUser) {
        // Update
        const payload: UserUpdate = {
          name: formValue.name!,
          email: formValue.email!,
          roles: selectedRoles,
        };
        await this.userService.updateUser(currentUser.id!, payload);
        toast.success('Usuario actualizado con éxito');
      } else {
        // Create
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
      console.error(e);
      toast.error(e.message || 'Ocurrió un error al guardar el usuario.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
