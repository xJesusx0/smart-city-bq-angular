import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import type { components, paths } from '../__gen__/api_v1';

export type Intersection = components['schemas']['Intersection'];
export type TrafficLight = components['schemas']['TrafficLight'];
export type CreateTrafficLightDTO = components['schemas']['CreateTrafficLightDTO'];
export type NeighborhoodInfo = components['schemas']['NeighborhoodInfo'];

@Injectable({ providedIn: 'root' })
export class SemaphoresService {
  private api = inject(ApiService);

  async getNeighborhoodByPoint(lat: number, lng: number): Promise<NeighborhoodInfo | null> {
    const { data, error } = await this.api.client.GET('/api/geo/neighborhoods/point', {
      params: {
        query: {
          latitude: lat,
          longitude: lng,
        },
      },
    });

    if (error) {
      return null;
    }

    return data ?? null;
  }

  async getNearbyIntersections(lat: number, lng: number, radius = 20): Promise<Intersection[]> {
    const { data, error } = await this.api.client.GET('/api/geo/intersections', {
      params: {
        query: {
          latitude: lat,
          longitude: lng,
          radius,
        },
      },
    });

    if (error) {
      throw new Error('Error fetching intersections');
    }

    return data ?? [];
  }

  async createTrafficLight(payload: CreateTrafficLightDTO): Promise<TrafficLight> {
    const { data, error } = await this.api.client.POST('/api/geo/traffic-lights', {
      body: payload,
    });

    if (error) {
      throw new Error(
        typeof error === 'object' && error !== null && 'detail' in error
          ? String(error.detail)
          : 'Error creating traffic light',
      );
    }

    return data;
  }
}
