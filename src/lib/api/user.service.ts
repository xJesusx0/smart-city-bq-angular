import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import type { components } from '../__gen__/api_v1';

type UserWithRoles = components['schemas']['UserWithRolesDTO'];
type UserUpdate = components['schemas']['UserUpdate'];

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  async getUsers(filters?: { active?: boolean | null }) {
    const { data, error } = await this.api.client.GET('/api/iam/users', {
      params: {
        query: filters || {},
      },
    });

    if (error) {
      throw new Error((error as any)?.message || 'Error al obtener los usuarios');
    }

    return (data || []) as UserWithRoles[];
  }

  async updateUser(userId: number, user: UserUpdate) {
    const { data, error } = await this.api.client.PUT('/api/iam/users/{user_id}', {
      params: {
        path: { user_id: userId },
      },
      body: user,
    });

    if (error) {
      throw new Error((error as any)?.message || 'Error al actualizar el usuario');
    }

    return data;
  }
}
