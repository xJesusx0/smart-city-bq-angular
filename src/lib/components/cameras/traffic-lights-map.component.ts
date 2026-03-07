import {
  Component,
  ChangeDetectionStrategy,
  afterNextRender,
  input,
  output,
  effect,
  viewChild,
  ElementRef,
  DestroyRef,
  inject,
} from '@angular/core';
import * as L from 'leaflet';
import type { components } from '../../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

export interface MapCoordinates {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-traffic-lights-map',
  imports: [],
  template: ` <div #mapContainer class="map-container"></div> `,
  styles: `
    :host {
      display: block;
    }

    .map-container {
      height: 600px;
      width: 100%;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid hsl(var(--border));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightsMapComponent {
  /** Traffic lights from the backend */
  trafficLights = input<TrafficLight[]>([]);

  /** Emitted when user wants to view details of a traffic light */
  viewDetails = output<TrafficLight>();

  /** Emitted when user selects coordinates on the map (click or drag) */
  coordinatesSelected = output<MapCoordinates>();

  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private map: L.Map | null = null;
  private markersLayer = L.layerGroup();
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.initMap();
    });

    effect(() => {
      const lights = this.trafficLights();
      this.updateMarkers(lights);
    });
  }

  private initMap(): void {
    const container = this.mapContainer().nativeElement;

    this.map = L.map(container, {
      center: L.latLng(10.9639, -74.7964), // Barranquilla
      zoom: 13,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© OpenStreetMap',
        }),
      ],
    });

    this.markersLayer.addTo(this.map);

    this.destroyRef.onDestroy(() => {
      this.map?.remove();
      this.map = null;
    });

    // Initial render of markers in case data is already available
    this.updateMarkers(this.trafficLights());
  }

  private updateMarkers(lights: TrafficLight[]): void {
    if (!this.map) return;

    this.markersLayer.clearLayers();

    for (const tl of lights) {
      const m = L.marker([tl.latitude || 0, tl.longitude || 0], {
        icon: L.icon({
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      });

      m.bindPopup(`
        <div class="p-2 min-w-[150px]">
          <h3 class="font-bold text-sm mb-1">${tl.name}</h3>
          <p class="text-xs text-muted-foreground mb-2">ID: ${tl.id}</p>
          <button class="w-full text-xs bg-primary text-primary-foreground rounded py-1 px-2 hover:opacity-90 transition-opacity" onclick="window.dispatchEvent(new CustomEvent('viewDetails', {detail: ${tl.id}}))">
            Ver detalles
          </button>
        </div>
      `);

      m.addTo(this.markersLayer);
    }
  }
}
