import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { RoleService } from '../../../../lib/api/role.service';
import { RoleDialogComponent } from '../../../../lib/components/admin/role-dialog.component';
import { RoleModulesDialogComponent } from '../../../../lib/components/admin/role-modules-dialog.component';
import { DeleteRoleDialogComponent } from '../../../../lib/components/admin/delete-role-dialog.component';
import { HlmButtonDirective } from '../../../../lib/components/ui/button';
import { LucideAngularModule, Shield, Pencil, Trash2, CheckCircle, Settings } from 'lucide-angular';
import type { components } from '../../../../lib/__gen__/api_v1';

type DbRole = components['schemas']['RoleWithModulesDTO'];

@Component({
    selector: 'app-admin-security',
    standalone: true,
    imports: [

        RoleDialogComponent,
        RoleModulesDialogComponent,
        DeleteRoleDialogComponent,
        HlmButtonDirective,
        LucideAngularModule,
    ],
    templateUrl: './security.html',
    styleUrl: './security.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSecurityComponent implements OnInit {
    private roleService = inject(RoleService);

    readonly ShieldIcon = Shield;
    readonly PencilIcon = Pencil;
    readonly Trash2Icon = Trash2;
    readonly CheckCircleIcon = CheckCircle;
    readonly SettingsIcon = Settings;

    roles = signal<DbRole[]>([]);
    isLoading = signal(false);
    isError = signal(false);

    filterActive = signal<boolean | null>(null);
    activatingRoleId = signal<number | null>(null);

    showCreateDialog = signal(false);
    showEditDialog = signal(false);
    showModulesDialog = signal(false);
    showDeleteDialog = signal(false);
    selectedRole = signal<DbRole | null>(null);

    filteredRoles = computed(() => {
        const active = this.filterActive();
        if (active === null) return this.roles();
        return this.roles().filter(r => r.active === active);
    });

    ngOnInit() {
        this.loadRoles();
    }

    async loadRoles() {
        this.isLoading.set(true);
        this.isError.set(false);
        try {
            const data = await this.roleService.getRoles({ active: this.filterActive() });
            this.roles.set(data);
        } catch (e: any) {
            console.error(e);
            this.isError.set(true);
        } finally {
            this.isLoading.set(false);
        }
    }

    handleCreate() {
        this.selectedRole.set(null);
        this.showCreateDialog.set(true);
    }

    handleEdit(role: DbRole) {
        this.selectedRole.set(role);
        this.showEditDialog.set(true);
    }

    handleModules(role: DbRole) {
        this.selectedRole.set(role);
        this.showModulesDialog.set(true);
    }

    handleDelete(role: DbRole) {
        this.selectedRole.set(role);
        this.showDeleteDialog.set(true);
    }

    async handleActivate(role: DbRole) {
        this.activatingRoleId.set(role.id!);
        try {
            await this.roleService.updateRole(role.id!, { active: true });
            await this.loadRoles();
        } finally {
            this.activatingRoleId.set(null);
        }
    }

    handleSuccess() {
        this.loadRoles();
    }

    setFilter(active: boolean | null) {
        this.filterActive.set(active);
        this.loadRoles();
    }
}
