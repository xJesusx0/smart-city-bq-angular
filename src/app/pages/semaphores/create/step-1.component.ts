import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LocationPickerMapComponent } from '../../../../lib/components/map/location-picker-map.component';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { SemaphoresService, Intersection } from '../../../../lib/api/semaphores.service';

export interface LocationData {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-semaphore-step-1',
  standalone: true,
  imports: [CommonModule, DecimalPipe, LocationPickerMapComponent],
  template: `
    <!-- Panel Lateral -->
    <div class="w-80 border-r bg-muted/20 p-6 flex flex-col h-full overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">Paso 1: Ubicación</h2>
      <p class="text-sm text-muted-foreground mb-6">
        Selecciona la ubicación aproximada del nuevo semáforo haciendo clic en el mapa interactivo.
      </p>

      @if (!location()) {
        <div
          class="bg-primary/10 border border-primary/20 rounded-md p-4 text-center text-sm text-primary mb-6"
        >
          Esperando selección en el mapa...
        </div>
      } @else if (intersectionsQuery.isPending()) {
        <div class="bg-card border rounded-md p-4 mb-6 shadow-sm">
          <h3 class="font-medium text-sm mb-2">Buscando intersecciones...</h3>
          <div class="animate-pulse flex flex-col gap-2">
            <div class="h-4 bg-muted rounded w-3/4"></div>
            <div class="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      } @else {
        <div class="bg-card border rounded-md p-4 mb-6 shadow-sm">
          <h3 class="font-medium text-sm mb-2">Coordenadas Seleccionadas</h3>
          <div class="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div class="font-medium text-foreground">Latitud:</div>
            <div>{{ location()?.lat | number: '1.4-4' }}</div>
            <div class="font-medium text-foreground">Longitud:</div>
            <div>{{ location()?.lng | number: '1.4-4' }}</div>
          </div>

          @if (intersectionsQuery.isError()) {
            <p class="text-destructive text-xs mt-2 mt-2">Error al buscar intersección.</p>
          } @else if (intersectionsQuery.data()?.length === 0) {
            <p class="text-muted-foreground text-xs mt-2 mt-2">
              No se encontró intersección cercana.
            </p>
          } @else if (intersectionsQuery.data()?.length) {
            <p class="text-primary text-xs mt-2 mt-2">
              Se encontró intersección a
              {{ intersectionsQuery.data()![0].distance_meters | number: '1.0-0' }}m
            </p>
          }
        </div>
      }

      <div class="mt-auto">
        <button
          class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          [disabled]="!location()"
          (click)="nextStep.emit()"
        >
          Continuar
        </button>
      </div>
    </div>

    <!-- Contenedor del Mapa -->
    <div class="flex-1 relative h-full flex flex-col justify-center items-center">
      <app-location-picker-map
        [location]="location()"
        (locationSelected)="locationSelected.emit($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemaphoreStep1Component {
  private semaphoresService = inject(SemaphoresService);

  location = input<LocationData | null>(null);

  locationSelected = output<LocationData>();
  intersectionFound = output<Intersection | null>();
  nextStep = output<void>();

  intersectionsQuery = injectQuery(() => ({
    queryKey: ['intersections', this.location()?.lat, this.location()?.lng],
    queryFn: () =>
      this.semaphoresService.getNearbyIntersections(this.location()!.lat, this.location()!.lng),
    enabled: !!this.location(),
  }));

  constructor() {
    effect(() => {
      const data = this.intersectionsQuery.data();
      if (data && data.length > 0) {
        this.intersectionFound.emit(data[0]);
      } else if (data?.length === 0) {
        this.intersectionFound.emit(null);
      }
    });
  }
}
