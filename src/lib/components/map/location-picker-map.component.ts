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
import { LocationData } from '../../../app/pages/semaphores/create/step-1.component';

@Component({
  selector: 'app-location-picker-map',
  standalone: true,
  imports: [],
  template: ` <div #mapContainer class="map-container"></div> `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .map-container {
      height: 100%;
      width: 100%;
      z-index: 10;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerMapComponent {
  /** Optional initial location or forced location from snap */
  location = input<LocationData | null>(null);

  /** Emitted when user selects coordinates on the map (click) */
  locationSelected = output<LocationData>();

  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.initMap();
    });

    effect(() => {
      const loc = this.location();
      this.updateMarker(loc);
    });
  }

  private initMap(): void {
    const container = this.mapContainer().nativeElement;

    // Default to Barranquilla Coordinates
    this.map = L.map(container, {
      center: L.latLng(10.9639, -74.7964),
      zoom: 14,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© OpenStreetMap',
        }),
      ],
    });

    // Handle map clicks
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.locationSelected.emit({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    });

    this.destroyRef.onDestroy(() => {
      this.map?.remove();
      this.map = null;
    });

    // Initial render of marker
    this.updateMarker(this.location());
  }

  private updateMarker(loc: LocationData | null): void {
    if (!this.map) return;

    if (!loc) {
      if (this.marker) {
        this.marker.remove();
        this.marker = null;
      }
      return;
    }

    const latLng = L.latLng(loc.lat, loc.lng);

    if (this.marker) {
      this.marker.setLatLng(latLng);
    } else {
      this.marker = L.marker(latLng, {
        icon: L.icon({
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      });
      this.marker.addTo(this.map);
    }

    // Pan map to the updated location seamlessly
    this.map.panTo(latLng, { animate: true });
  }
}
