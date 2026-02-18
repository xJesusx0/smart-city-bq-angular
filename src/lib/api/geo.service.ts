import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import type { components } from '../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Injectable({ providedIn: 'root' })
export class GeoService {
    private api = inject(ApiService);

    /**
     * Get all traffic lights with optional filters
     */
    async getTrafficLights(filters?: {
        name?: string | null;
        intersection_id?: number | null;
        longitude?: number | null;
        latitude?: number | null;
    }) {
        const { data, error } = await this.api.client.GET('/api/geo/traffic-lights', {
            params: {
                query: filters || {},
            },
        });

        if (error) {
            throw new Error((error as any)?.message || 'Error al obtener los semáforos');
        }

        return (data || []).filter(Boolean) as TrafficLight[];
    }
}
