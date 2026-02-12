import { Routes } from '@angular/router';
import { authGuard } from '../lib/guards/auth.guard';

export const routes: Routes = [
    // Public routes
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
    },
    {
        path: 'change-password',
        loadComponent: () =>
            import('./pages/change-password/change-password').then(
                (m) => m.ChangePasswordComponent
            ),
    },
    {
        path: 'unauthorized',
        loadComponent: () =>
            import('./pages/unauthorized/unauthorized').then((m) => m.UnauthorizedComponent),
    },

    // Protected routes (app)
    {
        path: '',
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
            },
            {
                path: 'cameras',
                loadComponent: () =>
                    import('./pages/cameras/cameras').then((m) => m.CamerasComponent),
            },
            {
                path: 'reports',
                loadComponent: () =>
                    import('./pages/reports/reports').then((m) => m.ReportsComponent),
            },
        ],
    },

    // 404 fallback
    {
        path: '**',
        loadComponent: () =>
            import('./pages/not-found/not-found').then((m) => m.NotFoundComponent),
    },
];

