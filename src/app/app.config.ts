import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { QueryClient, provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { MsalService } from '@azure/msal-angular';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { AuthQueryService } from '../lib/auth/auth-query.service';
import { provideMsalStandalone } from '../lib/auth/msal.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptorsFromDi()),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
          },
        },
      }),
    ),
    ...provideMsalStandalone(),
    provideAppInitializer(async () => {
      const msalService = inject(MsalService);
      const authQuery = inject(AuthQueryService);

      // Initialize MSAL before anything else
      await firstValueFrom(msalService.initialize());

      // Then load the current user (if already authenticated via cookie)
      return authQuery.loadCurrentUser();
    }),
  ],
};
