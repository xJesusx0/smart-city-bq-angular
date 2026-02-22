import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { UserService } from '../../../../lib/api/user.service';
import { UserDialogComponent } from '../../../../lib/components/admin/user-dialog.component';
import { DeleteUserDialogComponent } from '../../../../lib/components/admin/delete-user-dialog.component';
import { HlmButtonDirective } from '../../../../lib/components/ui/button';
import { LucideAngularModule, UserPlus, Pencil, Trash2, CheckCircle } from 'lucide-angular';
import type { components } from '../../../../lib/__gen__/api_v1';

type UserWithRoles = components['schemas']['UserWithRolesDTO'];

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    UserDialogComponent,
    DeleteUserDialogComponent,
    HlmButtonDirective,
    LucideAngularModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);

  readonly UserPlusIcon = UserPlus;
  readonly PencilIcon = Pencil;
  readonly Trash2Icon = Trash2;
  readonly CheckCircleIcon = CheckCircle;

  users = signal<UserWithRoles[]>([]);
  isLoading = signal(false);
  isError = signal(false);

  filterActive = signal<boolean | null>(null);
  activatingUserId = signal<number | null>(null);

  showCreateDialog = signal(false);
  showEditDialog = signal(false);
  showDeleteDialog = signal(false);
  selectedUser = signal<UserWithRoles | null>(null);

  filteredUsers = computed(() => {
    const active = this.filterActive();
    if (active === null) return this.users();
    return this.users().filter((u) => u.active === active);
  });

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading.set(true);
    this.isError.set(false);
    try {
      const data = await this.userService.getUsers({ active: this.filterActive() });
      this.users.set(data);
    } catch (e: any) {
      console.error(e);
      this.isError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleCreate() {
    this.selectedUser.set(null);
    this.showCreateDialog.set(true);
  }

  handleEdit(user: UserWithRoles) {
    this.selectedUser.set(user);
    this.showEditDialog.set(true);
  }

  handleDelete(user: UserWithRoles) {
    this.selectedUser.set(user);
    this.showDeleteDialog.set(true);
  }

  async handleActivate(user: UserWithRoles) {
    this.activatingUserId.set(user.id!);
    try {
      await this.userService.updateUser(user.id!, { active: true });
      await this.loadUsers();
    } finally {
      this.activatingUserId.set(null);
    }
  }

  handleSuccess() {
    this.loadUsers();
  }

  setFilter(active: boolean | null) {
    this.filterActive.set(active);
    this.loadUsers();
  }
}
