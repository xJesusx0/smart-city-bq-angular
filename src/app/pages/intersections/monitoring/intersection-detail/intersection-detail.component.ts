import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionWithStatus } from '../../../../../lib/api/semaphores.service';
import { HlmButtonDirective } from '../../../../../lib/components/ui/button/hlm-button.directive';
import { HlmCardImports } from '../../../../../lib/components/ui/card';
import { HlmIconComponent } from '../../../../../lib/components/ui/icon/hlm-icon.component';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideActivity, lucideCpu, lucideClock, lucideCheckCircle2, lucideXCircle } from '@ng-icons/lucide';

@Component({
  selector: 'app-intersection-detail',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, ...HlmCardImports, HlmIconComponent],
  providers: [
    provideIcons({ lucideArrowLeft, lucideActivity, lucideCpu, lucideClock, lucideCheckCircle2, lucideXCircle }),
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <button hlmBtn variant="ghost" size="sm" (click)="back.emit()">
          <hlm-icon name="lucideArrowLeft" class="mr-2 h-4 w-4" />
          Volver al listado
        </button>
        <h2 class="text-2xl font-bold">Intersección #{{ intersection().id }}</h2>
      </div>

      @if (!intersection().realtime_data) {
        <div class="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg border border-dashed border-red-200">
          <hlm-icon name="lucideXCircle" class="h-12 w-12 text-red-500 mb-4" />
          <p class="text-lg font-semibold text-red-600">Dispositivo fuera de línea</p>
          <p class="text-muted-foreground">No hay datos en tiempo real disponibles para esta intersección actualmente.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- SECCIÓN: Dispositivo -->
          <section hlmCard>
            <div hlmCardHeader>
              <h3 hlmCardTitle class="flex items-center gap-2 text-primary">
                <hlm-icon name="lucideCpu" class="h-5 w-5" />
                Dispositivo
              </h3>
            </div>
            <div hlmCardContent class="grid gap-4">
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Nombre del dispositivo</span>
                <span class="font-bold">{{ intersection().realtime_data?.device_name }}</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Dirección IP</span>
                <span class="font-mono text-sm bg-muted px-2 rounded">{{ intersection().realtime_data?.ip }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Última comunicación</span>
                <span class="font-medium">{{ formattedLastSeen() }}</span>
              </div>
            </div>
          </section>

          <!-- SECCIÓN: Estado Actual -->
          <section hlmCard>
            <div hlmCardHeader>
              <h3 hlmCardTitle class="flex items-center gap-2 text-primary">
                <hlm-icon name="lucideActivity" class="h-5 w-5" />
                Estado Actual
              </h3>
            </div>
            <div hlmCardContent class="grid gap-4">
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Estado exacto</span>
                <span 
                  class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset uppercase"
                  [ngClass]="getStateBadgeClass(intersection().realtime_data?.estado)"
                >
                  {{ intersection().realtime_data?.estado }}
                </span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Tiempo restante del estado</span>
                <span class="font-bold text-lg text-primary">{{ intersection().realtime_data?.estado_restante_s }} seg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Tiempo restante del ciclo</span>
                <span class="font-bold text-lg">{{ intersection().realtime_data?.ciclo_restante_s }} seg</span>
              </div>
            </div>
          </section>

          <!-- SECCIÓN: Configuración del Ciclo Actual -->
          <section hlmCard>
            <div hlmCardHeader>
              <h3 hlmCardTitle class="flex items-center gap-2 text-primary">
                <hlm-icon name="lucideClock" class="h-5 w-5" />
                Tiempos del Ciclo Actual
              </h3>
            </div>
            <div hlmCardContent class="grid gap-4">
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Verde Semáforo 1</span>
                <span class="font-bold text-green-600">{{ intersection().realtime_data?.semaforo1_verde }}s</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Verde Semáforo 2</span>
                <span class="font-bold text-green-600">{{ intersection().realtime_data?.semaforo2_verde }}s</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Rojo Total (Seguridad)</span>
                <span class="font-bold text-red-600">{{ intersection().realtime_data?.all_red_time }}s</span>
              </div>
            </div>
          </section>

          <!-- SECCIÓN: Próxima Configuración -->
          <section hlmCard>
            <div hlmCardHeader>
              <h3 hlmCardTitle class="flex items-center gap-2 text-primary">
                <hlm-icon name="lucideCheckCircle2" class="h-5 w-5" />
                Próximo Ciclo
              </h3>
            </div>
            <div hlmCardContent class="grid gap-4">
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Próximo Verde Semáforo 1</span>
                <span class="font-medium">{{ intersection().realtime_data?.next_semaforo1 }}s</span>
              </div>
              <div class="flex justify-between border-b pb-2">
                <span class="text-muted-foreground">Próximo Verde Semáforo 2</span>
                <span class="font-medium">{{ intersection().realtime_data?.next_semaforo2 }}s</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Sincronización con servidor</span>
                <span 
                   class="font-bold text-xs px-2 py-0.5 rounded"
                   [class.bg-green-100]="intersection().realtime_data?.next_fetched"
                   [class.text-green-700]="intersection().realtime_data?.next_fetched"
                   [class.bg-amber-100]="!intersection().realtime_data?.next_fetched"
                   [class.text-amber-700]="!intersection().realtime_data?.next_fetched"
                >
                  {{ intersection().realtime_data?.next_fetched ? 'DESCARGADA' : 'PENDIENTE' }}
                </span>
              </div>
            </div>
          </section>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntersectionDetailComponent {
  intersection = input.required<IntersectionWithStatus>();
  back = output<void>();

  formattedLastSeen = computed(() => {
    const lastSeen = this.intersection().realtime_data?.last_seen;
    if (!lastSeen) return 'N/A';
    // Utilizando el formato local para Jesus
    return new Date(lastSeen * 1000).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
  });

  getStateBadgeClass(estado?: string): string {
    if (!estado) return 'bg-gray-50 text-gray-600 ring-gray-500/10';

    switch (estado) {
      case 'S1_VERDE':
      case 'S2_VERDE':
        return 'bg-green-100 text-green-700 ring-green-600/20';
      case 'S1_AMARILLO':
      case 'S2_AMARILLO':
        return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      case 'S1_ROJO':
      case 'S2_ROJO':
        return 'bg-red-100 text-red-700 ring-red-600/20';
      case 'S1_ROJO_AMARILLO':
      case 'S2_ROJO_AMARILLO':
        return 'bg-orange-100 text-orange-700 ring-orange-600/20';
      case 'ALL_RED':
        return 'bg-red-200 text-red-900 ring-red-800/30 font-bold';
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
  }
}
