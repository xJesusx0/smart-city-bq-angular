import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionWithStatus } from '../../../../../lib/api/semaphores.service';
import { HlmButtonDirective } from '../../../../../lib/components/ui/button/hlm-button.directive';
import { HlmCardImports } from '../../../../../lib/components/ui/card';
import { HlmIconComponent } from '../../../../../lib/components/ui/icon/hlm-icon.component';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideCheckCircle2,
  lucideWifiOff,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-intersection-detail',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, ...HlmCardImports, HlmIconComponent],
  providers: [provideIcons({ lucideArrowLeft, lucideCheckCircle2, lucideWifiOff })],
  template: `
    <div class="flex flex-col gap-6">

      <!-- ── TOPBAR ── -->
      <div class="flex items-center justify-between border-b pb-4">
        <div class="flex items-center gap-3">

          <!-- Botón volver: icon + texto alineados con flexbox en el propio botón -->
          <button
            hlmBtn
            variant="outline"
            size="sm"
            (click)="back.emit()"
            class="h-8 px-3 flex items-center gap-1.5 text-xs"
          >
            <hlm-icon name="lucideArrowLeft" class="h-3.5 w-3.5 shrink-0 translate-y-0" />
            <span class="leading-none">Volver</span>
          </button>

          <div class="h-5 w-px bg-border"></div>

          <div>
            <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none mb-1">
              Intersección
            </p>
            <h2 class="text-base font-semibold tracking-tight leading-none">
              #{{ intersection().id }}
            </h2>
          </div>
        </div>

        <!-- Live badge -->
        <div class="flex items-center gap-1.5 border rounded-md px-3 py-2 bg-muted/30">
          <span class="relative flex h-1.5 w-1.5 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"></span>
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          <span class="text-[11px] font-medium text-muted-foreground leading-none">Live</span>
        </div>
      </div>

      <!-- ── OFFLINE ── -->
      @if (!intersection().realtime_data) {
        <div class="flex flex-col items-center justify-center py-24 gap-4 border border-dashed rounded-md">
          <hlm-icon name="lucideWifiOff" class="h-8 w-8 text-muted-foreground/30" />
          <div class="text-center">
            <p class="text-sm font-semibold">Dispositivo fuera de línea</p>
            <p class="text-xs text-muted-foreground mt-1 max-w-xs">
              El controlador no envía telemetría. Verifique el módulo CPU o la conexión de red.
            </p>
          </div>
        </div>
      }

      <!-- ── ONLINE ── -->
      @if (intersection().realtime_data) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <!-- COL 1: Semáforos + Timer -->
          <div class="flex flex-col gap-4">

            <!-- Semáforos -->
            <div class="border rounded-md p-4">
              <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Estado Visual
              </p>
              <div class="flex items-center justify-around">
                <div class="flex flex-col items-center gap-3">
                  <div class="bg-zinc-950 p-2 flex flex-col gap-1.5 border border-zinc-800">
                    <div class="h-6 w-6 rounded-full transition-colors duration-500"
                      [class.bg-red-500]="isRed('S1')" [class.bg-zinc-800]="!isRed('S1')"></div>
                    <div class="h-6 w-6 rounded-full transition-colors duration-500"
                      [class.bg-amber-400]="isYellow('S1')" [class.bg-zinc-800]="!isYellow('S1')"></div>
                    <div class="h-6 w-6 rounded-full transition-colors duration-500"
                      [class.bg-emerald-500]="isGreen('S1')" [class.bg-zinc-800]="!isGreen('S1')"></div>
                  </div>
                  <span class="text-[10px] font-medium text-muted-foreground">Calle A · S1</span>
                </div>

                <div class="w-px h-8 bg-border"></div>

                <div class="flex flex-col items-center gap-3">
                  <div class="bg-zinc-950 p-2 flex flex-col gap-1.5 border border-zinc-800">
                    <div class="h-6 w-6 rounded-full transition-colors duration-500"
                      [class.bg-red-500]="isRed('S2')" [class.bg-zinc-800]="!isRed('S2')"></div>
                    <div class="h-6 w-6 rounded-full transition-colors duration-500"
                      [class.bg-amber-400]="isYellow('S2')" [class.bg-zinc-800]="!isYellow('S2')"></div>
                    <div class="h-6 w-6 rounded-full transition-colors duration-500"
                      [class.bg-emerald-500]="isGreen('S2')" [class.bg-zinc-800]="!isGreen('S2')"></div>
                  </div>
                  <span class="text-[10px] font-medium text-muted-foreground">Calle B · S2</span>
                </div>
              </div>
            </div>

            <!-- Timer -->
            <div class="border rounded-md p-4 flex flex-col gap-3">
              <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Siguiente cambio
              </p>
              <div class="flex items-center gap-4">
                <svg class="h-16 w-16 -rotate-90 shrink-0">
                  <circle cx="32" cy="32" r="26" fill="transparent"
                    stroke="currentColor" stroke-width="3" class="text-border" />
                  <circle cx="32" cy="32" r="26" fill="transparent"
                    stroke="currentColor" stroke-width="3"
                    class="text-foreground transition-all duration-1000"
                    [style.stroke-dasharray]="163"
                    [style.stroke-dashoffset]="timerOffset()" />
                </svg>
                <div>
                  <div class="flex items-baseline gap-0.5">
                    <span class="font-mono text-3xl font-bold tracking-tighter leading-none">
                      {{ intersection().realtime_data?.estado_restante_s }}
                    </span>
                    <span class="text-xs text-muted-foreground leading-none">s</span>
                  </div>
                  <p class="text-[10px] text-muted-foreground mt-1.5">
                    Ciclo: <span class="font-mono font-semibold text-foreground">{{ intersection().realtime_data?.ciclo_restante_s }}s</span>
                  </p>
                </div>
              </div>
              <div class="h-px bg-muted overflow-hidden">
                <div class="h-full bg-foreground transition-all duration-1000"
                  [style.width.%]="(intersection().realtime_data?.ciclo_restante_s || 0) / 1.2">
                </div>
              </div>
            </div>

          </div>

          <!-- COL 2: Hardware + Ciclo -->
          <div class="flex flex-col gap-4">

            <div class="border rounded-md p-4">
              <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Hardware & Red
              </p>
              <div class="flex flex-col divide-y">
                <div class="pb-3">
                  <p class="text-[10px] text-muted-foreground mb-1">Nombre del dispositivo</p>
                  <p class="text-sm font-medium">{{ intersection().realtime_data?.device_name }}</p>
                </div>
                <div class="py-3">
                  <p class="text-[10px] text-muted-foreground mb-1">Dirección IP</p>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs bg-muted border px-2 py-0.5">
                      {{ intersection().realtime_data?.ip }}
                    </span>
                    <hlm-icon name="lucideCheckCircle2" class="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  </div>
                </div>
                <div class="pt-3">
                  <p class="text-[10px] text-muted-foreground mb-1">Último reporte</p>
                  <p class="text-sm font-mono font-medium">{{ formattedLastSeen() }}</p>
                </div>
              </div>
            </div>

            <div class="border rounded-md p-4">
              <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Protocolo de Ciclo
              </p>
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="border p-2.5">
                  <p class="text-[9px] font-medium uppercase text-muted-foreground">Verde S1</p>
                  <p class="font-mono text-lg font-bold text-emerald-600 leading-tight mt-0.5">
                    {{ intersection().realtime_data?.semaforo1_verde }}<span class="text-xs font-normal">s</span>
                  </p>
                </div>
                <div class="border p-2.5">
                  <p class="text-[9px] font-medium uppercase text-muted-foreground">Verde S2</p>
                  <p class="font-mono text-lg font-bold text-emerald-600 leading-tight mt-0.5">
                    {{ intersection().realtime_data?.semaforo2_verde }}<span class="text-xs font-normal">s</span>
                  </p>
                </div>
              </div>
              <div class="flex items-center justify-between border border-dashed px-3 py-2">
                <div>
                  <p class="text-[9px] font-semibold uppercase text-red-600">All-Red Safety Gap</p>
                  <p class="text-[10px] text-muted-foreground">Protocolo de seguridad</p>
                </div>
                <span class="font-mono text-base font-bold text-red-600">
                  {{ intersection().realtime_data?.all_red_time }}s
                </span>
              </div>
            </div>

          </div>

          <!-- COL 3: Próximo Ciclo -->
          <div class="border rounded-md p-4 flex flex-col gap-4">

            <div class="flex items-center justify-between">
              <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Estrategia Próximo Ciclo
              </p>
              <span
                class="text-[10px] font-medium px-2 py-1 border uppercase leading-none"
                [class.text-emerald-700]="intersection().realtime_data?.next_fetched"
                [class.border-emerald-200]="intersection().realtime_data?.next_fetched"
                [class.bg-emerald-50]="intersection().realtime_data?.next_fetched"
                [class.text-amber-700]="!intersection().realtime_data?.next_fetched"
                [class.border-amber-200]="!intersection().realtime_data?.next_fetched"
                [class.bg-amber-50]="!intersection().realtime_data?.next_fetched"
              >
                {{ intersection().realtime_data?.next_fetched ? 'Sync OK' : 'Syncing…' }}
              </span>
            </div>

            <div class="flex flex-col divide-y flex-1">
              <div class="py-4 flex items-center gap-4">
                <div class="h-11 w-11 border flex items-center justify-center font-mono text-xl font-bold bg-muted/30 shrink-0">
                  {{ intersection().realtime_data?.next_semaforo1 }}
                </div>
                <div>
                  <p class="text-xs font-semibold leading-none">Fase A — S1</p>
                  <p class="text-[10px] text-muted-foreground mt-1">Duración proyectada</p>
                </div>
              </div>
              <div class="py-4 flex items-center gap-4">
                <div class="h-11 w-11 border flex items-center justify-center font-mono text-xl font-bold bg-muted/30 shrink-0">
                  {{ intersection().realtime_data?.next_semaforo2 }}
                </div>
                <div>
                  <p class="text-xs font-semibold leading-none">Fase B — S2</p>
                  <p class="text-[10px] text-muted-foreground mt-1">Duración proyectada</p>
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <p class="text-[10px] text-muted-foreground mb-2">Estado actual</p>
              <span
                class="inline-flex items-center px-2 py-1 text-[10px] font-mono font-medium uppercase border leading-none"
                [ngClass]="getStateBadgeClass(intersection().realtime_data?.estado)"
              >
                {{ intersection().realtime_data?.estado }}
              </span>
            </div>

          </div>
        </div>
      }
    </div>
  `,
  styles: `:host { display: block; width: 100%; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntersectionDetailComponent {
  intersection = input.required<IntersectionWithStatus>();
  back = output<void>();

  formattedLastSeen = computed(() => {
    const lastSeen = this.intersection().realtime_data?.last_seen;
    if (!lastSeen) return 'N/A';
    return new Date(lastSeen * 1000).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  });

  getStateBadgeClass(estado?: string): string {
    switch (estado) {
      case 'S1_VERDE': case 'S2_VERDE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'S1_AMARILLO': case 'S2_AMARILLO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'S1_ROJO': case 'S2_ROJO':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'S1_ROJO_AMARILLO': case 'S2_ROJO_AMARILLO':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ALL_RED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  }

  isRed(semaphore: 'S1' | 'S2'): boolean {
    const estado = this.intersection().realtime_data?.estado;
    if (!estado) return false;
    if (estado === 'ALL_RED') return true;
    if (semaphore === 'S1') return estado.startsWith('S1_ROJO') || estado.startsWith('S2');
    return estado.startsWith('S2_ROJO') || estado.startsWith('S1');
  }

  isYellow(semaphore: 'S1' | 'S2'): boolean {
    const estado = this.intersection().realtime_data?.estado;
    if (!estado) return false;
    return semaphore === 'S1' ? estado.includes('S1_AMARILLO') : estado.includes('S2_AMARILLO');
  }

  isGreen(semaphore: 'S1' | 'S2'): boolean {
    const estado = this.intersection().realtime_data?.estado;
    if (!estado) return false;
    return semaphore === 'S1' ? estado === 'S1_VERDE' : estado === 'S2_VERDE';
  }

  timerOffset = computed(() => {
    const restante = this.intersection().realtime_data?.estado_restante_s || 0;
    const max = Math.max(60, restante);
    return 163 - (restante / max) * 163;
  });
}