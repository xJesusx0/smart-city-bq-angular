import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import type { components } from '../__gen__/api_v1';

type DbRole = components['schemas']['RoleWithModulesDTO'];
type RoleUpdate = components['schemas']['RoleUpdate'];

@Injectable({ providedIn: 'root' })
export class RoleService {
    private api = inject(ApiService);

    async getRoles(filters?: { active?: boolean | null }) {
        const { data, error } = await this.api.client.GET('/api/iam/roles', {
            params: {
                query: filters || {},
            },
        });

        if (error) {
            throw new Error((error as any)?.message || 'Error al obtener los roles');
        }

        return (data || []) as DbRole[];
    }

    async updateRole(roleId: number, role: RoleUpdate) {
        const { data, error } = await this.api.client.PUT('/api/iam/roles/{role_id}', {
            params: {
                path: { role_id: roleId },
            },
            body: role,
        });

        if (error) {
            throw new Error((error as any)?.message || 'Error al actualizar el rol');
        }

        return data;
    }
}
