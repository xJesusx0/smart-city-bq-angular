import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LocationPickerMapComponent } from '../../../../lib/components/map/location-picker-map.component';
import { Intersection } from '../../../../lib/api/semaphores.service';
import { LocationData } from './step-1.component';
import { HlmButtonDirective } from '../../../../lib/components/ui/button/hlm-button.directive';

@Component({
  selector: 'app-semaphore-step-2',
  imports: [CommonModule, DecimalPipe, LocationPickerMapComponent, HlmButtonDirective],
  template: `
    <!-- Panel Lateral -->
    <div class="w-80 border-r bg-muted/20 p-6 flex flex-col h-full overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">Paso 2: Validación</h2>
      <p class="text-sm text-muted-foreground mb-6">
        Se verifica la distancia de la ubicación seleccionada a la intersección más cercana.
      </p>

      @if (!intersection()) {
        <div class="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6 shadow-sm">
          <h3 class="font-medium text-sm text-destructive mb-2">Sin intersección</h3>
          <p class="text-xs text-muted-foreground">
            No se detectó ninguna intersección cerca de la coordenada seleccionada. Regrese al paso
            anterior y seleccione un punto diferente.
          </p>
        </div>
      } @else {
        <div class="rounded-xl border bg-card text-card-foreground shadow-sm mb-6">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="font-semibold leading-none tracking-tight text-lg">Detalles detectados</h3>
            <p class="text-sm text-muted-foreground">Información de la intersección</p>
          </div>
          <div class="p-6 pt-0 grid gap-2 text-sm">
            <div class="grid grid-cols-2 gap-1 text-muted-foreground">
              <span class="font-medium text-foreground">Avenida/Calle A:</span>
              <span>{{ intersection()?.street_a_name || 'Desconocido' }}</span>

              <span class="font-medium text-foreground">Avenida/Calle B:</span>
              <span>{{ intersection()?.street_b_name || 'Desconocido' }}</span>

              <span class="font-medium text-foreground">Distancia:</span>
              <span [class.text-destructive]="!isValid()">
                {{ intersection()?.distance_meters | number: '1.0-1' }} m
              </span>
            </div>
          </div>
        </div>

        @if (isValid()) {
          <div class="bg-primary/10 border border-primary/20 rounded-md p-4 mb-6 shadow-sm">
            <h3 class="font-medium text-sm text-primary mb-2">¡Validación Exitosa!</h3>
            <p class="text-xs text-muted-foreground">
              La ubicación seleccionada está dentro del margen permitido (20 metros) de la intersección detectada.
            </p>
          </div>
        } @else {
          <div class="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6 shadow-sm">
            <h3 class="font-medium text-sm text-destructive mb-2">Distancia excedida</h3>
            <p class="text-xs text-muted-foreground">
              La ubicación está demasiado lejos ({{ intersection()?.distance_meters | number:'1.0-1' }}m) de la intersección. El máximo permitido es 20m.
            </p>
          </div>
        }
        }

        <div class="mt-auto flex flex-col gap-3">
        <button 
          hlmBtn
          variant="outline"
          class="w-full"
          (click)="previousStep.emit()"
        >
          Volver atrás
        </button>

        <button 
          hlmBtn
          class="w-full"
          [disabled]="!isValid()"
          (click)="confirmLocation()"
        >
          Confirmar ubicación
        </button>
        </div>
        </div>

        <!-- Contenedor del Mapa -->
        <div class="flex-1 relative h-full flex flex-col justify-center items-center pointer-events-none">
        <app-location-picker-map
        [location]="originalLocation()"
        />

        @if (isValid()) {
        <div class="absolute bottom-6 bg-background/90 backdrop-blur border text-sm px-4 py-2 rounded-full shadow-lg text-primary font-medium animate-in fade-in slide-in-from-bottom-4">
          Ubicación validada correctamente
        </div>
        }
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
        export class SemaphoreStep2Component {
        originalLocation = input.required<LocationData>();
        intersection = input<Intersection | null>(null);

        nextStep = output<void>();
        previousStep = output<void>();
        locationConfirmed = output<LocationData>();

        isValid = computed(() => {
        const inter = this.intersection();
        if (!inter || typeof inter.distance_meters !== 'number') return false;
        return inter.distance_meters <= 20;
        });

        confirmLocation() {
        if (this.isValid()) {
        this.locationConfirmed.emit(this.originalLocation());
        this.nextStep.emit();
        }
        }
        }

