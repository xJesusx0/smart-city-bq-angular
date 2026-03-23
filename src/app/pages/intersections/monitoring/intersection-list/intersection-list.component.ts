import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionWithStatus } from '../../../../../lib/api/semaphores.service';
import { HlmButtonDirective } from '../../../../../lib/components/ui/button/hlm-button.directive';
import { HlmIconComponent } from '../../../../../lib/components/ui/icon/hlm-icon.component';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideRadio, lucideMapPin } from '@ng-icons/lucide';
import { HlmBadgeDirective } from '../../../../../lib/components/ui/badge/hlm-badge.directive';

@Component({
  selector: 'app-intersection-list',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, HlmIconComponent, HlmBadgeDirective],
  providers: [provideIcons({ lucideChevronRight, lucideRadio, lucideMapPin })],
  template: `
    <div class="w-full">
      <!-- ── HEADER ── -->
      <div
        class="grid border-b px-4 py-2.5 bg-muted/20"
        style="grid-template-columns: 52px 1fr 110px 160px 130px 170px 52px"
      >
        <span class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >#</span
        >
        <span class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >Intersección</span
        >
        <span class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >Conexión</span
        >
        <span class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >Estado</span
        >
        <span class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >Fase restante</span
        >
        <span class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >Ciclo S1 / S2</span
        >
        <span
          class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right"
          >Ver</span
        >
      </div>

      @for (intersection of intersections(); track intersection.id) {
        <div
          class="grid border-b hover:bg-accent/40 transition-colors duration-150 cursor-pointer group"
          style="grid-template-columns: 52px 1fr 110px 160px 130px 170px 52px"
          (click)="viewDetails.emit(intersection)"
        >
          <!-- ID -->
          <div class="flex items-center px-4 py-3.5">
            <span class="font-mono text-[11px] font-medium text-muted-foreground/60">{{
              intersection.id
            }}</span>
          </div>

          <!-- Intersección: nombres de calles + distancia -->
          <div class="flex flex-col justify-center gap-1 px-2 py-3.5 min-w-0">
            <!-- Calle A -->
            <div class="flex items-center gap-1.5 min-w-0">
              <span
                class="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 shrink-0 w-3"
                >A</span
              >
              <span class="text-xs font-semibold truncate leading-none">
                {{ intersection.street_a_name ?? intersection.street_a_id }}
              </span>
            </div>
            <!-- Calle B -->
            <div class="flex items-center gap-1.5 min-w-0">
              <span
                class="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 shrink-0 w-3"
                >B</span
              >
              <span class="text-[11px] text-muted-foreground truncate leading-none">
                {{ intersection.street_b_name ?? intersection.street_b_id }}
              </span>
            </div>
            <!-- Distancia -->
            @if (intersection.distance_meters) {
              <div class="flex items-center gap-1 mt-0.5">
                <hlm-icon
                  name="lucideMapPin"
                  size="9px"
                  class="text-muted-foreground/40 shrink-0"
                />
                <span class="text-[9px] text-muted-foreground/50">{{
                  formatDistance(intersection.distance_meters)
                }}</span>
              </div>
            }
          </div>

          <!-- Conexión + dispositivo -->
          <div class="flex flex-col justify-center gap-1 px-2 py-3.5">
            @if (intersection.realtime_data) {
              <div class="flex items-center gap-1.5">
                <span class="relative flex h-1.5 w-1.5 shrink-0">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"
                  ></span>
                  <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                <span class="text-[11px] font-medium text-emerald-600">Online</span>
              </div>
              <span class="text-[9px] text-muted-foreground/60 font-mono truncate">
                {{ intersection.realtime_data.ip }}
              </span>
            } @else {
              <div class="flex items-center gap-1.5">
                <span class="flex h-1.5 w-1.5 rounded-full bg-muted-foreground/30 shrink-0"></span>
                <span class="text-[11px] font-medium text-muted-foreground">Offline</span>
              </div>
            }
          </div>

          <!-- Estado + sync próximo ciclo -->
          <div class="flex flex-col justify-center gap-1.5 px-2 py-3.5">
            <span
              hlmBadge
              variant="outline"
              class="self-start rounded-sm text-[10px] font-mono font-semibold uppercase"
              [class]="getStateBadgeClass(intersection.realtime_data?.estado)"
            >
              {{ intersection.realtime_data?.estado ?? 'SIN SEÑAL' }}
            </span>
            @if (intersection.realtime_data) {
              <span
                class="text-[9px] font-medium leading-none"
                [class.text-emerald-600]="intersection.realtime_data.next_fetched"
                [class.text-amber-500]="!intersection.realtime_data.next_fetched"
              >
                {{ intersection.realtime_data.next_fetched ? '✓ Próximo sync' : '⟳ Sincronizando' }}
              </span>
            }
          </div>

          <!-- Fase restante -->
          <div class="flex items-center px-2 py-3.5 pr-3">
            @if (intersection.realtime_data) {
              <div class="flex flex-col gap-1.5 w-full">
                <div class="flex items-baseline gap-1">
                  <span class="font-mono text-base font-bold tabular-nums leading-none">
                    {{ intersection.realtime_data.estado_restante_s }}
                  </span>
                  <span class="text-[10px] text-muted-foreground">s</span>
                  <span class="text-[9px] text-muted-foreground/50 ml-auto font-mono">
                    /{{ intersection.realtime_data.ciclo_restante_s }}s
                  </span>
                </div>
                <div class="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-1000"
                    [class.bg-emerald-500]="isGreenState(intersection.realtime_data.estado)"
                    [class.bg-amber-400]="isYellowState(intersection.realtime_data.estado)"
                    [class.bg-red-500]="isRedState(intersection.realtime_data.estado)"
                    [style.width.%]="getPhaseProgress(intersection)"
                  ></div>
                </div>
              </div>
            } @else {
              <span class="text-[11px] text-muted-foreground/40">—</span>
            }
          </div>

          <!-- Ciclo S1 / S2 -->
          <div class="flex items-center px-2 py-3.5">
            @if (intersection.realtime_data) {
              <div class="flex flex-col gap-1.5 w-full">
                <!-- S1 -->
                <div class="flex items-center gap-1.5">
                  <span class="text-[9px] font-semibold text-muted-foreground/60 w-3 shrink-0"
                    >S1</span
                  >
                  <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      class="h-full bg-emerald-500 rounded-full transition-all"
                      [style.width.%]="getS1Percent(intersection)"
                    ></div>
                  </div>
                  <span class="font-mono text-[10px] text-muted-foreground w-7 text-right shrink-0">
                    {{ intersection.realtime_data.semaforo1_verde }}s
                  </span>
                </div>
                <!-- S2 -->
                <div class="flex items-center gap-1.5">
                  <span class="text-[9px] font-semibold text-muted-foreground/60 w-3 shrink-0"
                    >S2</span
                  >
                  <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      class="h-full bg-emerald-700 rounded-full transition-all"
                      [style.width.%]="getS2Percent(intersection)"
                    ></div>
                  </div>
                  <span class="font-mono text-[10px] text-muted-foreground w-7 text-right shrink-0">
                    {{ intersection.realtime_data.semaforo2_verde }}s
                  </span>
                </div>
              </div>
            } @else {
              <span class="text-[11px] text-muted-foreground/40">—</span>
            }
          </div>

          <!-- Acción -->
          <div class="flex items-center justify-center py-3.5">
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <hlm-icon name="lucideChevronRight" size="14px" />
            </button>
          </div>
        </div>
      } @empty {
        <div class="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <hlm-icon name="lucideRadio" size="28px" class="opacity-20" />
          <p class="text-xs font-medium uppercase tracking-widest">Sin telemetría disponible</p>
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
export class IntersectionListComponent {
  intersections = input.required<IntersectionWithStatus[]>();
  viewDetails = output<IntersectionWithStatus>();

  formatDistance(meters: number): string {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${Math.round(meters)} m`;
  }

  getStateBadgeClass(estado?: string): string {
    switch (estado) {
      case 'S1_VERDE':
      case 'S2_VERDE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'S1_AMARILLO':
      case 'S2_AMARILLO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'S1_ROJO':
      case 'S2_ROJO':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'S1_ROJO_AMARILLO':
      case 'S2_ROJO_AMARILLO':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ALL_RED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  }

  isGreenState(estado?: string): boolean {
    return !!estado?.includes('VERDE');
  }
  isYellowState(estado?: string): boolean {
    return !!estado?.includes('AMARILLO');
  }
  isRedState(estado?: string): boolean {
    return !!estado?.includes('ROJO') || estado === 'ALL_RED';
  }

  getTotalCycle(intersection: IntersectionWithStatus): number {
    const d = intersection.realtime_data;
    if (!d) return 0;
    return (d.semaforo1_verde || 0) + (d.semaforo2_verde || 0) + (d.all_red_time || 0) * 2;
  }

  getS1Percent(intersection: IntersectionWithStatus): number {
    const total = this.getTotalCycle(intersection);
    if (!total) return 0;
    return Math.round(((intersection.realtime_data?.semaforo1_verde || 0) / total) * 100);
  }

  getS2Percent(intersection: IntersectionWithStatus): number {
    const total = this.getTotalCycle(intersection);
    if (!total) return 0;
    return Math.round(((intersection.realtime_data?.semaforo2_verde || 0) / total) * 100);
  }

  getPhaseProgress(intersection: IntersectionWithStatus): number {
    const d = intersection.realtime_data;
    if (!d) return 0;
    const restante = d.estado_restante_s || 0;
    const estado = d.estado || '';
    let phaseDuration = 0;
    if (estado === 'S1_VERDE') phaseDuration = d.semaforo1_verde || 0;
    else if (estado === 'S2_VERDE') phaseDuration = d.semaforo2_verde || 0;
    else if (estado === 'ALL_RED') phaseDuration = d.all_red_time || 0;
    else phaseDuration = Math.max(restante, 5);
    if (!phaseDuration) return 0;
    return Math.min(100, Math.round((restante / phaseDuration) * 100));
  }
}
