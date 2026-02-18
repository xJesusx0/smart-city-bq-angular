import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LucideAngularModule, MapPin, Eye } from 'lucide-angular';
import { latLng, tileLayer, marker, icon } from 'leaflet';
import type { components } from '../../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Component({
  selector: 'app-traffic-lights-map',
  standalone: true,
  imports: [
    CommonModule,
    LeafletModule,
    LucideAngularModule,
  ],
  template: `
    <div class="h-[600px] w-full rounded-lg overflow-hidden border"
         leaflet
         [leafletOptions]="options"
         [leafletLayers]="layers()">
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightsMapComponent {
  trafficLights = input<TrafficLight[]>([]);
  viewDetails = output<TrafficLight>();

  readonly MapPinIcon = MapPin;
  readonly EyeIcon = Eye;

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
      })
    ],
    zoom: 13,
    center: latLng(10.9639, -74.7964) // Barranquilla
  };

  layers = () => {
    return this.trafficLights().map(tl => {
      const m = marker([tl.latitude || 0, tl.longitude || 0], {
        icon: icon({
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
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

      return m;
    });
  };
}
