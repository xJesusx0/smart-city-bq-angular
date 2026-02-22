import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { HlmCardImports } from '../ui/card';
import { LucideAngularModule, TrafficCone, CircleDot, Circle } from 'lucide-angular';
import type { components } from '../../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Component({
  selector: 'app-traffic-lights-stats',
  imports: [...HlmCardImports, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      <section hlmCard class="group relative overflow-hidden">
        <div hlmCardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Total de semáforos</p>
              <p class="mt-2 text-3xl font-bold">{{ total() }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-sm font-medium text-muted-foreground">
                  Registrados en el sistema
                </span>
              </div>
            </div>
            <div class="rounded-full bg-muted/50 p-3">
              <lucide-icon
                [name]="TrafficConeIcon"
                class="h-6 w-6 text-muted-foreground"
              ></lucide-icon>
            </div>
          </div>
        </div>
      </section>

      <section hlmCard class="group relative overflow-hidden">
        <div hlmCardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Semáforos activos</p>
              <p class="mt-2 text-3xl font-bold">{{ active() }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-sm font-medium text-muted-foreground"> En funcionamiento </span>
              </div>
            </div>
            <div class="rounded-full bg-muted/50 p-3">
              <lucide-icon
                [name]="CircleDotIcon"
                class="h-6 w-6 text-muted-foreground"
              ></lucide-icon>
            </div>
          </div>
        </div>
      </section>

      <section hlmCard class="group relative overflow-hidden">
        <div hlmCardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Semáforos inactivos</p>
              <p class="mt-2 text-3xl font-bold">{{ inactive() }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-sm font-medium text-muted-foreground"> Fuera de servicio </span>
              </div>
            </div>
            <div class="rounded-full bg-muted/50 p-3">
              <lucide-icon [name]="CircleIcon" class="h-6 w-6 text-muted-foreground"></lucide-icon>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightsStatsComponent {
  trafficLights = input<TrafficLight[]>([]);

  readonly total = computed(() => this.trafficLights().length);
  readonly active = computed(() => this.trafficLights().filter((tl) => tl.active).length);
  readonly inactive = computed(() => this.trafficLights().filter((tl) => !tl.active).length);

  readonly TrafficConeIcon = TrafficCone;
  readonly CircleDotIcon = CircleDot;
  readonly CircleIcon = Circle;
}
