/**
 * API & Auth configuration
 *
 * Config values are sourced from the .env file at build time
 * using @ngx-env/builder.
 *
 * Note: @ngx-env/builder requires custom variables to be prefixed
 * with NG_APP_, but it also automatically exposes VITE_ variables
 * for compatibility.
 */

export const TOKEN_KEY = 'jwt_token';
export const BASE_URL = (import.meta as any).env?.NG_APP_API_URL ?? 'http://localhost:8000';
export const GOOGLE_CLIENT_ID = (import.meta as any).env?.NG_APP_GOOGLE_CLIENT_ID ?? '';
export const IS_PROD = (import.meta as any).env?.PROD ?? false;
export const MSAL_CLIENT_ID = (import.meta as any).env?.NG_APP_MSAL_CLIENT_ID ?? '';
export const MSAL_TENANT_ID = (import.meta as any).env?.NG_APP_MSAL_TENANT_ID ?? '';
