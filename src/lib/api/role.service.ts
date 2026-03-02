import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import type { components } from '../__gen__/api_v1';

type DbRole = components['schemas']['RoleWithModulesDTO'];
type RoleCreate = components['schemas']['RoleCreate'];
type RoleUpdate = components['schemas']['RoleUpdate'];
type ModuleBase = components['schemas']['ModuleBase'];

@Injectable({ providedIn: 'root' })
export class RoleService {
  private api = inject(ApiService);

  async getRoles(filters?: { active?: boolean | null }) {
    const { data, error } = await this.api.client.GET('/api/iam/roles/with-modules', {
      params: {
        query: filters || {},
      },
    });

    if (error) {
      throw new Error((error as any)?.message || 'Error al obtener los roles');
    }

    return (data || []) as DbRole[];
  }

  async createRole(role: RoleCreate) {
    const { data, error } = await this.api.client.POST('/api/iam/roles', {
      body: role,
    });

    if (error) {
      throw new Error((error as any)?.message || 'Error al crear el rol');
    }

    return data;
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

  async deleteRole(roleId: number) {
    const { error } = await this.api.client.DELETE('/api/iam/roles/{role_id}', {
      params: {
        path: { role_id: roleId },
      },
    });

    if (error) {
      throw new Error((error as any)?.message || 'Error al eliminar el rol');
    }
  }

  async getModules(filters?: { active?: boolean | null }) {
    const { data, error } = await this.api.client.GET('/api/iam/modules', {
      params: {
        query: filters || {},
      },
    });

    if (error) {
      throw new Error((error as any)?.message || 'Error al obtener los módulos');
    }

    return (data || []) as ModuleBase[];
  }
}
