import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Intersection,
  SemaphoresService,
  CreateTrafficLightDTO,
} from '../../../../lib/api/semaphores.service';
import { LocationData } from './step-1.component';
import { HlmButtonDirective } from '../../../../lib/components/ui/button/hlm-button.directive';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { HlmLabelDirective } from '../../../../lib/components/ui/label';
import { HlmInputDirective } from '../../../../lib/components/ui/input';

@Component({
  selector: 'app-semaphore-step-3',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HlmLabelDirective,
    HlmInputDirective,
    HlmButtonDirective,
  ],
  template: `
    <div class="p-6 w-full max-w-2xl mx-auto flex flex-col h-full overflow-y-auto">
      <div class="mb-8">
        <h2 class="text-2xl font-bold tracking-tight">Detalles del Semáforo</h2>
        <p class="text-muted-foreground">
          Complete la información técnica para registrar el activo.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6 flex-1">
        <!-- Datos Geográficos Bloqueados -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label hlmLabel for="neighborhood">Barrio (Automático)</label>
            <input
              hlmInput
              id="neighborhood"
              disabled
              [value]="neighborhoodInfo()?.neighborhood_name || 'No definido'"
              class="w-full bg-muted/50"
            />
          </div>
          <div class="space-y-2">
            <label hlmLabel for="city">Ciudad (Automático)</label>
            <input
              hlmInput
              id="city"
              disabled
              [value]="neighborhoodInfo()?.city_name || 'No definido'"
              class="w-full bg-muted/50"
            />
          </div>
          <div class="space-y-2 md:col-span-2">
             <label hlmLabel for="location">Coordenadas guardadas</label>
             <input hlmInput id="location" disabled [value]="location().lat + ', ' + location().lng" class="w-full bg-muted/50 font-mono text-sm" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label hlmLabel for="intersection">Intersección detectada</label>
            <input
              hlmInput
              id="intersection"
              disabled
              [value]="intersection()?.street_a_name + ' con ' + intersection()?.street_b_name"
              class="w-full bg-muted/50"
            />
          </div>
        </div>

        <div class="h-px bg-border w-full my-6"></div>

        <!-- Detalles Técnicos -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label hlmLabel for="name">Nombre / Referencia *</label>
            <input
              hlmInput
              id="name"
              formControlName="name"
              placeholder="Ej. Semáforo Norte 45"
              class="w-full"
            />
            @if (form.controls['name'].invalid && form.controls['name'].touched) {
              <p class="text-sm text-destructive">
                El nombre es requerido y debe tener al menos 3 caracteres.
              </p>
            }
          </div>

          <div class="space-y-2">
            <label hlmLabel for="active">Estado de Operación *</label>
            <select
              id="active"
              formControlName="active"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo / Mantenimiento</option>
            </select>
          </div>
        </div>

        <!-- Error Message from API -->
        @if (createMutation.isError()) {
          <div
            class="bg-destructive/15 text-destructive border border-destructive/20 p-4 rounded-md text-sm mt-4"
          >
            {{ errorMessage() }}
          </div>
        }

        <div class="flex justify-between pt-6 mt-auto border-t">

          <button
            type="button"
            hlmBtn
            variant="outline"
            (click)="previousStep.emit()"
            [disabled]="createMutation.isPending()"
          >
            Volver atrás
          </button>

          <button
            type="submit"
            hlmBtn
            [disabled]="form.invalid || createMutation.isPending() || !intersection()?.id"
          >
            @if (createMutation.isPending()) {
              Guardando...
            } @else {
              Crear Semáforo
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemaphoreStep3Component {
  private fb = inject(FormBuilder);
  private semaphoresService = inject(SemaphoresService);

  location = input.required<LocationData>();
  intersection = input<Intersection | null>(null);

  previousStep = output<void>();
  saved = output<void>();

  neighborhoodQuery = injectQuery(() => ({
    queryKey: ['neighborhood', this.location()?.lat, this.location()?.lng],
    queryFn: () =>
      this.semaphoresService.getNeighborhoodByPoint(this.location().lat, this.location().lng),
    enabled: !!this.location(),
  }));

  neighborhoodInfo = computed(() => this.neighborhoodQuery.data());

  errorMessage = computed(() => {
    const error = this.createMutation.error();
    if (!error) return null;
    return (error as any).message || 'Ocurrió un error al guardar';
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    active: ['true', Validators.required],
  });

  createMutation = injectMutation(() => ({
    mutationFn: (data: CreateTrafficLightDTO) => this.semaphoresService.createTrafficLight(data),
    onSuccess: () => {
      this.saved.emit();
    },
  }));

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const currentLoc = this.location();
    const currentInter = this.intersection();

    if (!currentLoc || !currentInter?.id) return;

    const payload: CreateTrafficLightDTO = {
      name: value.name!,
      latitude: currentLoc.lat,
      longitude: currentLoc.lng,
      intersection_id: currentInter.id,
    };

    this.createMutation.mutate(payload);
  }
}
