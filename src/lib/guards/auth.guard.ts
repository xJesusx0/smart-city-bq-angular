import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Auth Guard - protects routes requiring authentication
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

/**
 * Route Access Guard - checks if user has access to specific routes
 */
export const routeAccessGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const path = route.routeConfig?.path || '';

  if (authService.hasAccessToRoute(`/${path}`)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
