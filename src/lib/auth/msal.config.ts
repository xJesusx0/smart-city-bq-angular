import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
  type IPublicClientApplication,
} from '@azure/msal-browser';
import {
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  type MsalGuardConfiguration,
  type MsalInterceptorConfiguration,
} from '@azure/msal-angular';

import { MSAL_CLIENT_ID, MSAL_TENANT_ID, BASE_URL } from '../api/const';

/**
 * MSAL log callback (only warnings & errors in production).
 */
function loggerCallback(logLevel: LogLevel, message: string): void {
  if (logLevel <= LogLevel.Warning) {
    console.warn(`[MSAL] ${message}`);
  }
}

/**
 * Factory: creates the PublicClientApplication instance.
 */
export function msalInstanceFactory(): IPublicClientApplication {
  const authority = MSAL_TENANT_ID
    ? `https://login.microsoftonline.com/${MSAL_TENANT_ID}`
    : 'https://login.microsoftonline.com/common';

  return new PublicClientApplication({
    auth: {
      clientId: MSAL_CLIENT_ID,
      authority,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: false,
      },
    },
  });
}

/**
 * Factory: configures MsalGuard to use Redirect interaction.
 */
export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
    loginFailedRoute: '/login',
  };
}

/**
 * Factory: configures MsalInterceptor to attach tokens
 * for protected API endpoints.
 */
export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, string[]>();

  // Only protect Microsoft Graph calls (if needed in the future).
  // Our own backend API uses cookie-based JWT auth, NOT MSAL tokens,
  // so it must NOT be in the protectedResourceMap.
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/*', ['user.read']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap,
  };
}

/**
 * Provides all MSAL-related services & configuration for standalone
 * Angular apps (no NgModule needed).
 *
 * Usage in `appConfig.providers`:
 * ```ts
 * providers: [
 *   ...provideMsalStandalone(),
 * ]
 * ```
 */
export function provideMsalStandalone(): Provider[] {
  return [
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: msalGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: msalInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
  ];
}
