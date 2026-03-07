import { Routes } from '@angular/router';
import { authGuard } from '../lib/guards/auth.guard';

export const routes: Routes = [
  // Redirect raíz a login por defecto
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./pages/change-password/change-password').then((m) => m.ChangePasswordComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized').then((m) => m.UnauthorizedComponent),
  },

  // Protected routes (app)
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminComponent),
        children: [
          {
            path: '',
            redirectTo: 'users',
            pathMatch: 'full',
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/users/users').then((m) => m.AdminUsersComponent),
          },
          {
            path: 'security',
            loadComponent: () =>
              import('./pages/admin/security/security').then((m) => m.AdminSecurityComponent),
          },
        ],
      },
      {
        path: 'cameras',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/cameras/cameras').then((m) => m.CamerasComponent),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/semaphores/create/create-semaphore.component').then(
                (m) => m.CreateSemaphoreComponent,
              ),
          },
        ],
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports').then((m) => m.ReportsComponent),
      },
    ],
  },

  // 404 fallback
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
