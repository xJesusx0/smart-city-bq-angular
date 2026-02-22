import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import createClient, { type Client } from 'openapi-fetch';
import type { paths } from '../__gen__/api_v1';
import { BASE_URL, TOKEN_KEY } from './const';
import { deleteCookie, getCookie } from './helpers';

/**
 * API Service using openapi-fetch for type-safe API calls
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private router = inject(Router);

  /**
   * Main API client with authentication
   */
  readonly client: Client<paths>;

  /**
   * Auth-specific client with form-urlencoded body serialization
   */
  readonly authClient: Client<paths>;

  constructor() {
    // Main API client
    this.client = createClient<paths>({
      baseUrl: BASE_URL,
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);

        const token = getCookie(TOKEN_KEY);
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(input, {
          ...init,
          headers,
          credentials: 'include',
        });

        if (response.status === 401) {
          deleteCookie(TOKEN_KEY);
          this.router.navigate(['/login']);
        }

        return response;
      },
    });

    // Auth client with form-urlencoded serialization
    this.authClient = createClient<paths>({
      baseUrl: BASE_URL,
      bodySerializer: (body) => {
        if (body && typeof body === 'object') {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(body)) {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          }
          return params.toString();
        }
        return String(body);
      },
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);

        const token = getCookie(TOKEN_KEY);
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const response = await fetch(input, {
          ...init,
          headers,
          credentials: 'include',
        });

        if (response.status === 401) {
          deleteCookie(TOKEN_KEY);
          this.router.navigate(['/login']);
        }

        return response;
      },
    });
  }
}
