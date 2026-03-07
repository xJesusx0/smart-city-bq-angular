import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Intersection } from '../../../../lib/api/semaphores.service';
import { SemaphoreStep1Component } from './step-1.component';
import { SemaphoreStep2Component } from './step-2.component';
import { SemaphoreStep3Component } from './step-3.component';

export interface LocationData {
  lat: number;
  lng: number;
}

export interface NearbyIntersection {
  neighborhood: string;
  city: string;
  distance: number;
  lat: number;
  lng: number;
}

export interface StepperState {
  currentStep: number;
  location: LocationData | null;
  intersection: Intersection | null;
  semaphoreDetails: any | null; // will be typed in step 3
}

@Component({
  selector: 'app-create-semaphore',
  standalone: true,
  imports: [SemaphoreStep1Component, SemaphoreStep2Component, SemaphoreStep3Component],
  template: `
    <div class="h-full w-full p-6 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight">Registro de Semáforo</h1>
        <p class="text-muted-foreground">
          Sigue los pasos para registrar un nuevo semáforo en el sistema.
        </p>
      </div>

      <!-- Stepper Progress Header -->
      <div class="flex items-center gap-4 border-b pb-4">
        <div
          class="flex items-center gap-2"
          [class.text-primary]="state().currentStep === 1"
          [class.text-muted-foreground]="state().currentStep !== 1"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2"
            [class.border-primary]="state().currentStep >= 1"
            [class.bg-primary]="state().currentStep >= 1"
            [class.text-primary-foreground]="state().currentStep >= 1"
          >
            1
          </div>
          <span class="font-medium">Ubicación</span>
        </div>
        <div class="h-px w-10 bg-border"></div>
        <div
          class="flex items-center gap-2"
          [class.text-primary]="state().currentStep === 2"
          [class.text-muted-foreground]="state().currentStep !== 2"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2"
            [class.border-primary]="state().currentStep >= 2"
            [class.bg-primary]="state().currentStep >= 2"
            [class.text-primary-foreground]="state().currentStep >= 2"
          >
            2
          </div>
          <span class="font-medium">Validación</span>
        </div>
        <div class="h-px w-10 bg-border"></div>
        <div
          class="flex items-center gap-2"
          [class.text-primary]="state().currentStep === 3"
          [class.text-muted-foreground]="state().currentStep !== 3"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2"
            [class.border-primary]="state().currentStep >= 3"
            [class.bg-primary]="state().currentStep >= 3"
            [class.text-primary-foreground]="state().currentStep >= 3"
          >
            3
          </div>
          <span class="font-medium">Detalles</span>
        </div>
      </div>

      <!-- Stepper Content -->
      <div class="flex-1 w-full min-h-0 bg-card rounded-lg border shadow-sm flex overflow-hidden">
        @if (state().currentStep === 1) {
          <app-semaphore-step-1
            [location]="state().location"
            (locationSelected)="onLocationSelected($event)"
            (intersectionFound)="onIntersectionFound($event)"
            (nextStep)="goToNextStep()"
          />
        } @else if (state().currentStep === 2 && state().location) {
          <app-semaphore-step-2
            [originalLocation]="state().location!"
            [intersection]="state().intersection"
            (locationConfirmed)="onLocationSelected($event)"
            (previousStep)="goToPreviousStep()"
            (nextStep)="goToNextStep()"
          />
        } @else if (state().currentStep === 3 && state().location) {
          <app-semaphore-step-3
            [location]="state().location!"
            [intersection]="state().intersection"
            (previousStep)="goToPreviousStep()"
            (saved)="onSaved()"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSemaphoreComponent {
  private router = inject(Router);

  readonly state = signal<StepperState>({
    currentStep: 1,
    location: null,
    intersection: null,
    semaphoreDetails: null,
  });

  onLocationSelected(location: LocationData) {
    this.state.update((s) => ({ ...s, location: { ...location } }));
  }

  onIntersectionFound(intersection: Intersection | null) {
    this.state.update((s) => ({ ...s, intersection }));
  }

  goToNextStep() {
    this.state.update((s) => ({ ...s, currentStep: s.currentStep + 1 }));
  }

  goToPreviousStep() {
    this.state.update((s) => ({ ...s, currentStep: Math.max(1, s.currentStep - 1) }));
  }

  onSaved() {
    this.router.navigate(['/app/cameras']);
  }
}
