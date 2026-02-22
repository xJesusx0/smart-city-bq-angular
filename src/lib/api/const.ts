/**
 * API & Auth configuration
 *
 * All config values are sourced from the environment files
 * (src/environments/environment.development.ts for dev,
 *  src/environments/environment.ts for production).
 *
 * Angular's fileReplacements in angular.json swaps the file at build time.
 */
import { environment } from '../../environments/environment.development';

export const TOKEN_KEY = 'jwt_token';
export const BASE_URL = environment.apiUrl;
export const GOOGLE_CLIENT_ID = environment.googleClientId;
export const IS_PROD = environment.production;
export const MSAL_CLIENT_ID = environment.msalClientId;
export const MSAL_TENANT_ID = environment.msalTenantId;
