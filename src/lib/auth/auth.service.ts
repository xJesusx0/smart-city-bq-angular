import { Injectable, signal, computed } from '@angular/core';
import type { components } from '../__gen__/api_v1';

type UserData = components['schemas']['UserWithModulesDTO'];
type Module = components['schemas']['ModuleBase'];
type RoleBase = components['schemas']['RoleBase'];

/**
 * Auth Service managing user state with Angular Signals
 * Equivalent to userStore from Svelte
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    /**
     * Current authenticated user
     */
    readonly user = signal<UserData | null>(null);

    /**
     * Derived: allowed routes for the current user
     */
    readonly allowedRoutes = computed(() => {
        const currentUser = this.user();
        return currentUser?.modules.map((m) => m.path) || [];
    });

    /**
     * Derived: roles of the current user
     */
    readonly userRoles = computed(() => {
        const currentUser = this.user();
        return currentUser?.roles || [];
    });

    /**
     * Derived: whether user is authenticated
     */
    readonly isAuthenticated = computed(() => this.user() !== null);

    /**
     * Set the current user
     */
    setUser(userData: UserData | null): void {
        this.user.set(userData);
    }

    /**
     * Clear user (logout)
     */
    clearUser(): void {
        this.user.set(null);
    }

    /**
     * Check if user has access to a specific route
     */
    hasAccessToRoute(route: string): boolean {
        const currentUser = this.user();
        if (!currentUser) return false;

        return currentUser.modules?.some((module: Module) => route.startsWith(module.path)) ?? false;
    }

    /**
     * Check if user has a specific role
     */
    hasRole(roleName: string): boolean {
        const currentUser = this.user();
        if (!currentUser) return false;

        return currentUser.roles?.some((role: RoleBase) => role.name === roleName) ?? false;
    }
}
