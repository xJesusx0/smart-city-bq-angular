/**
 * API configuration
 *
 * - `VITE_API_URL` is used at build/runtime by Vite. When running locally,
 *   define `VITE_API_URL` in the project's `.env` to point to your backend.
 * - In production (Vercel), set the environment variable `VITE_API_URL`
 *   in the Vercel dashboard for the project so the frontend calls the
 *   correct API endpoint. If the variable is not present, the code falls
 *   back to the public Vercel-hosted API at
 *   `https://smart-city-bq-traffic-api.vercel.app`.
 *
 * Notes:
 * - If your backend uses cookies for auth and the frontend is served from
 *   a different origin, ensure the backend allows CORS and sets
 *   `Access-Control-Allow-Credentials: true` and cookies with `SameSite=None`.
 */
export const TOKEN_KEY = 'jwt_token';
export const BASE_URL =
    (import.meta as any).env?.VITE_API_URL ?? 'https://smart-city-bq-traffic-api.vercel.app';
export const GOOGLE_CLIENT_ID =
    (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ??
    '';
export const IS_PROD = (import.meta as any).env?.PROD ?? false;
