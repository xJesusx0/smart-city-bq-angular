/**
 * API & Auth configuration
 *
 * Config values are sourced from the .env file at build time
 * using @ngx-env/builder.
 */

export const TOKEN_KEY = 'jwt_token';
export const BASE_URL = import.meta.env?.NG_APP_API_URL ?? 'http://localhost:8000';
export const GOOGLE_CLIENT_ID = import.meta.env?.NG_APP_GOOGLE_CLIENT_ID ?? '';
export const IS_PROD = import.meta.env?.PROD ?? false;
export const MSAL_CLIENT_ID = import.meta.env?.NG_APP_MSAL_CLIENT_ID ?? '';
export const MSAL_TENANT_ID = import.meta.env?.NG_APP_MSAL_TENANT_ID ?? '';
