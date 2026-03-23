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
  lucideActivity,
  lucideTimer,
  lucideNetwork,
  lucideCalendarClock,
  lucideGauge,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-intersection-detail',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, ...HlmCardImports, HlmIconComponent],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideCheckCircle2,
      lucideWifiOff,
      lucideActivity,
      lucideTimer,
      lucideNetwork,
      lucideCalendarClock,
      lucideGauge,
    }),
  ],
  template: `
    <div class="flex flex-col gap-5">
      <!-- ── TOPBAR ── -->
      <div class="flex items-center justify-between border-b pb-4">
        <div class="flex items-center gap-3">
          <button
            hlmBtn
            variant="outline"
            size="sm"
            (click)="back.emit()"
            class="h-8 px-3 flex items-center gap-1.5 text-xs"
          >
            <hlm-icon name="lucideArrowLeft" size="14px" />
            <span class="leading-none">Volver</span>
          </button>

          <div class="h-5 w-px bg-border"></div>

          <div>
            <p
              class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none mb-1"
            >
              Intersección
            </p>
            <h2 class="text-base font-semibold tracking-tight leading-none">
              {{ streetLabelA() }} <span class="text-muted-foreground font-normal">✕</span>
              {{ streetLabelB() }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Connection quality indicator -->
          @if (intersection().realtime_data) {
            <div class="flex items-center gap-1.5 border rounded-md px-3 py-2 bg-muted/30">
              <span class="relative flex h-1.5 w-1.5 shrink-0">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"
                ></span>
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span class="text-[11px] font-medium text-muted-foreground leading-none"
                >Live · {{ intersection().realtime_data?.device_name }}</span
              >
            </div>
          }
          <div class="flex items-center gap-1.5 border rounded-md px-3 py-2 bg-muted/30">
            <span class="font-mono text-[11px] text-muted-foreground leading-none"
              >#{{ intersection().id }}</span
            >
          </div>
        </div>
      </div>

      <!-- ── OFFLINE ── -->
      @if (!intersection().realtime_data) {
        <div
          class="flex flex-col items-center justify-center py-24 gap-4 border border-dashed rounded-md"
        >
          <hlm-icon name="lucideWifiOff" size="28px" class="text-muted-foreground/30" />
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
        <!-- ── METRICS ROW ── -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Estado actual -->
          <div class="border rounded-md p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideActivity" size="14px" class="text-muted-foreground" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Estado
              </p>
            </div>
            <span
              class="inline-flex items-center self-start px-2 py-1 text-[10px] font-mono font-semibold uppercase border leading-none"
              [ngClass]="getStateBadgeClass(intersection().realtime_data?.estado)"
            >
              {{ intersection().realtime_data?.estado }}
            </span>
            <p class="text-[10px] text-muted-foreground leading-tight">
              {{ stateDescription() }}
            </p>
          </div>

          <!-- Tiempo restante -->
          <div class="border rounded-md p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideTimer" size="14px" class="text-muted-foreground" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Fase restante
              </p>
            </div>
            <div class="flex items-baseline gap-0.5">
              <span class="font-mono text-2xl font-bold tracking-tighter leading-none">
                {{ intersection().realtime_data?.estado_restante_s }}
              </span>
              <span class="text-xs text-muted-foreground">s</span>
            </div>
            <!-- Phase progress bar -->
            <div class="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000"
                [class.bg-emerald-500]="isGreenState()"
                [class.bg-amber-400]="isYellowState()"
                [class.bg-red-500]="isRedState()"
                [style.width.%]="phaseProgress()"
              ></div>
            </div>
          </div>

          <!-- Ciclo restante -->
          <div class="border rounded-md p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideGauge" size="14px" class="text-muted-foreground" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Ciclo restante
              </p>
            </div>
            <div class="flex items-baseline gap-0.5">
              <span class="font-mono text-2xl font-bold tracking-tighter leading-none">
                {{ intersection().realtime_data?.ciclo_restante_s }}
              </span>
              <span class="text-xs text-muted-foreground">s</span>
            </div>
            <div class="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-foreground rounded-full transition-all duration-1000"
                [style.width.%]="cycleProgress()"
              ></div>
            </div>
          </div>

          <!-- Último reporte -->
          <div class="border rounded-md p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideCalendarClock" size="14px" class="text-muted-foreground" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Último reporte
              </p>
            </div>
            <p class="text-sm font-mono font-semibold leading-none">{{ formattedLastSeen() }}</p>
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideCheckCircle2" size="12px" class="text-emerald-500" />
              <span class="text-[10px] text-muted-foreground">Conexión activa</span>
            </div>
          </div>
        </div>

        <!-- ── MAIN GRID ── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- COL 1: Semáforos + Timer circular -->
          <div class="flex flex-col gap-4">
            <!-- Semáforos visuales -->
            <div class="border rounded-md p-4">
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-5"
              >
                Estado Visual
              </p>
              <div class="flex items-end justify-around gap-4">
                <!-- S1 -->
                <div class="flex flex-col items-center gap-3">
                  <!-- Semáforo estilizado -->
                  <div class="flex flex-col items-center">
                    <!-- Brazo superior -->
                    <div class="w-px h-2 bg-zinc-600/60"></div>
                    <!-- Cuerpo -->
                    <div
                      class="bg-zinc-900 border border-zinc-700/50 rounded-[3px] px-1.5 py-2 flex flex-col gap-1.5"
                      style="width:22px"
                    >
                      <!-- Rojo -->
                      <div
                        class="rounded-full transition-all duration-500 mx-auto"
                        style="width:12px;height:12px"
                        [style.background]="isRed('S1') ? '#ef4444' : '#27272a'"
                        [style.box-shadow]="
                          isRed('S1') ? '0 0 6px 1px rgba(239,68,68,0.5)' : 'none'
                        "
                      ></div>
                      <!-- Ámbar -->
                      <div
                        class="rounded-full transition-all duration-500 mx-auto"
                        style="width:12px;height:12px"
                        [style.background]="isYellow('S1') ? '#fbbf24' : '#27272a'"
                        [style.box-shadow]="
                          isYellow('S1') ? '0 0 6px 1px rgba(251,191,36,0.5)' : 'none'
                        "
                      ></div>
                      <!-- Verde -->
                      <div
                        class="rounded-full transition-all duration-500 mx-auto"
                        style="width:12px;height:12px"
                        [style.background]="isGreen('S1') ? '#34d399' : '#27272a'"
                        [style.box-shadow]="
                          isGreen('S1') ? '0 0 6px 1px rgba(52,211,153,0.5)' : 'none'
                        "
                      ></div>
                    </div>
                    <!-- Poste -->
                    <div class="w-px h-4 bg-zinc-600/60"></div>
                    <!-- Base -->
                    <div class="h-px bg-zinc-600/60" style="width:14px"></div>
                  </div>
                  <!-- Etiquetas -->
                  <div class="text-center">
                    <span class="text-[10px] font-semibold text-muted-foreground block leading-none"
                      >S1</span
                    >
                    <span
                      class="text-[9px] text-muted-foreground/50 block truncate mt-0.5"
                      style="max-width:60px"
                      >{{ streetLabelA() }}</span
                    >
                  </div>
                  <span
                    class="text-[9px] font-mono font-semibold px-1.5 py-0.5 border uppercase leading-none rounded-sm"
                    [ngClass]="getPhaseClass('S1')"
                    >{{ getPhaseLabel('S1') }}</span
                  >
                </div>

                <div class="w-px bg-border" style="height:80px;margin-bottom:52px"></div>

                <!-- S2 -->
                <div class="flex flex-col items-center gap-3">
                  <div class="flex flex-col items-center">
                    <div class="w-px h-2 bg-zinc-600/60"></div>
                    <div
                      class="bg-zinc-900 border border-zinc-700/50 rounded-[3px] px-1.5 py-2 flex flex-col gap-1.5"
                      style="width:22px"
                    >
                      <div
                        class="rounded-full transition-all duration-500 mx-auto"
                        style="width:12px;height:12px"
                        [style.background]="isRed('S2') ? '#ef4444' : '#27272a'"
                        [style.box-shadow]="
                          isRed('S2') ? '0 0 6px 1px rgba(239,68,68,0.5)' : 'none'
                        "
                      ></div>
                      <div
                        class="rounded-full transition-all duration-500 mx-auto"
                        style="width:12px;height:12px"
                        [style.background]="isYellow('S2') ? '#fbbf24' : '#27272a'"
                        [style.box-shadow]="
                          isYellow('S2') ? '0 0 6px 1px rgba(251,191,36,0.5)' : 'none'
                        "
                      ></div>
                      <div
                        class="rounded-full transition-all duration-500 mx-auto"
                        style="width:12px;height:12px"
                        [style.background]="isGreen('S2') ? '#34d399' : '#27272a'"
                        [style.box-shadow]="
                          isGreen('S2') ? '0 0 6px 1px rgba(52,211,153,0.5)' : 'none'
                        "
                      ></div>
                    </div>
                    <div class="w-px h-4 bg-zinc-600/60"></div>
                    <div class="h-px bg-zinc-600/60" style="width:14px"></div>
                  </div>
                  <div class="text-center">
                    <span class="text-[10px] font-semibold text-muted-foreground block leading-none"
                      >S2</span
                    >
                    <span
                      class="text-[9px] text-muted-foreground/50 block truncate mt-0.5"
                      style="max-width:60px"
                      >{{ streetLabelB() }}</span
                    >
                  </div>
                  <span
                    class="text-[9px] font-mono font-semibold px-1.5 py-0.5 border uppercase leading-none rounded-sm"
                    [ngClass]="getPhaseClass('S2')"
                    >{{ getPhaseLabel('S2') }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Timer circular -->
            <div class="border rounded-md p-4 flex flex-col gap-3">
              <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Siguiente cambio de fase
              </p>
              <div class="flex items-center gap-4">
                <div class="relative shrink-0">
                  <svg class="h-20 w-20 -rotate-90">
                    <!-- Track -->
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="transparent"
                      stroke="currentColor"
                      stroke-width="3.5"
                      class="text-border"
                    />
                    <!-- Progress -->
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="transparent"
                      stroke="currentColor"
                      stroke-width="3.5"
                      class="transition-all duration-1000"
                      [class.text-emerald-500]="isGreenState()"
                      [class.text-amber-400]="isYellowState()"
                      [class.text-red-500]="isRedState()"
                      [class.text-foreground]="!isGreenState() && !isYellowState() && !isRedState()"
                      [style.stroke-dasharray]="201"
                      [style.stroke-dashoffset]="timerOffset()"
                    />
                  </svg>
                  <!-- Center text -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <span class="font-mono text-lg font-bold tracking-tighter leading-none">
                        {{ intersection().realtime_data?.estado_restante_s }}
                      </span>
                      <span class="block text-[9px] text-muted-foreground leading-none mt-0.5"
                        >seg</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2 flex-1">
                  <div>
                    <p class="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Ciclo total restante
                    </p>
                    <p class="font-mono text-sm font-semibold">
                      {{ intersection().realtime_data?.ciclo_restante_s }}s
                    </p>
                  </div>
                  <div class="h-px bg-border"></div>
                  <div>
                    <p class="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">
                      Próxima fase
                    </p>
                    <p class="text-[10px] font-medium">{{ nextPhaseDescription() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- COL 2: Hardware + Protocolo de ciclo visual -->
          <div class="flex flex-col gap-4">
            <!-- Hardware & Red -->
            <div class="border rounded-md p-4">
              <div class="flex items-center gap-1.5 mb-4">
                <hlm-icon name="lucideNetwork" size="14px" class="text-muted-foreground" />
                <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Hardware & Red
                </p>
              </div>
              <div class="flex flex-col divide-y">
                <div class="pb-3">
                  <p class="text-[10px] text-muted-foreground mb-1">Nombre del dispositivo</p>
                  <p class="text-sm font-semibold">
                    {{ intersection().realtime_data?.device_name }}
                  </p>
                </div>
                <div class="py-3">
                  <p class="text-[10px] text-muted-foreground mb-1.5">Dirección IP</p>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs bg-muted border px-2 py-1 rounded-sm">
                      {{ intersection().realtime_data?.ip }}
                    </span>
                    <hlm-icon name="lucideCheckCircle2" size="14px" class="text-emerald-500" />
                  </div>
                </div>
                <div class="pt-3">
                  <p class="text-[10px] text-muted-foreground mb-1">Último reporte</p>
                  <p class="text-sm font-mono font-medium">{{ formattedLastSeen() }}</p>
                </div>
              </div>
            </div>

            <!-- Protocolo visual como timeline de ciclo -->
            <div class="border rounded-md p-4">
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-4"
              >
                Distribución del Ciclo
              </p>

              <!-- Breakdown visual del ciclo completo -->
              <div class="mb-4">
                <p class="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">
                  Ciclo completo
                </p>
                <div class="flex h-6 rounded-sm overflow-hidden border">
                  <!-- S1 Verde -->
                  <div
                    class="bg-emerald-500/80 flex items-center justify-center transition-all"
                    [style.flex]="intersection().realtime_data?.semaforo1_verde"
                    [title]="'S1 Verde: ' + intersection().realtime_data?.semaforo1_verde + 's'"
                  >
                    <span class="text-[8px] text-white font-semibold truncate px-0.5"
                      >{{ intersection().realtime_data?.semaforo1_verde }}s</span
                    >
                  </div>
                  <!-- All-Red 1 -->
                  <div
                    class="bg-red-800/80 flex items-center justify-center"
                    [style.flex]="intersection().realtime_data?.all_red_time"
                  >
                    <span class="text-[8px] text-white font-semibold px-0.5">AR</span>
                  </div>
                  <!-- S2 Verde -->
                  <div
                    class="bg-emerald-700/80 flex items-center justify-center transition-all"
                    [style.flex]="intersection().realtime_data?.semaforo2_verde"
                    [title]="'S2 Verde: ' + intersection().realtime_data?.semaforo2_verde + 's'"
                  >
                    <span class="text-[8px] text-white font-semibold truncate px-0.5"
                      >{{ intersection().realtime_data?.semaforo2_verde }}s</span
                    >
                  </div>
                  <!-- All-Red 2 -->
                  <div
                    class="bg-red-800/80 flex items-center justify-center"
                    [style.flex]="intersection().realtime_data?.all_red_time"
                  >
                    <span class="text-[8px] text-white font-semibold px-0.5">AR</span>
                  </div>
                </div>
                <!-- Leyenda -->
                <div class="flex items-center gap-3 mt-2 flex-wrap">
                  <div class="flex items-center gap-1">
                    <div class="h-2 w-2 bg-emerald-500/80 rounded-sm"></div>
                    <span class="text-[9px] text-muted-foreground">S1 Verde</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="h-2 w-2 bg-emerald-700/80 rounded-sm"></div>
                    <span class="text-[9px] text-muted-foreground">S2 Verde</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="h-2 w-2 bg-red-800/80 rounded-sm"></div>
                    <span class="text-[9px] text-muted-foreground">All-Red</span>
                  </div>
                </div>
              </div>

              <!-- Tiempos detallados -->
              <div class="grid grid-cols-2 gap-2">
                <div class="border p-2.5 rounded-sm">
                  <p class="text-[9px] font-medium uppercase text-muted-foreground">Verde S1</p>
                  <p class="font-mono text-xl font-bold text-emerald-600 leading-tight mt-0.5">
                    {{ intersection().realtime_data?.semaforo1_verde
                    }}<span class="text-xs font-normal text-muted-foreground">s</span>
                  </p>
                  <p class="text-[9px] text-muted-foreground mt-1">
                    {{ s1Percentage() }}% del ciclo
                  </p>
                </div>
                <div class="border p-2.5 rounded-sm">
                  <p class="text-[9px] font-medium uppercase text-muted-foreground">Verde S2</p>
                  <p class="font-mono text-xl font-bold text-emerald-600 leading-tight mt-0.5">
                    {{ intersection().realtime_data?.semaforo2_verde
                    }}<span class="text-xs font-normal text-muted-foreground">s</span>
                  </p>
                  <p class="text-[9px] text-muted-foreground mt-1">
                    {{ s2Percentage() }}% del ciclo
                  </p>
                </div>
              </div>

              <div
                class="flex items-center justify-between border border-dashed px-3 py-2 mt-2 rounded-sm"
              >
                <div>
                  <p class="text-[9px] font-semibold uppercase text-red-600">All-Red Safety Gap</p>
                  <p class="text-[9px] text-muted-foreground">× 2 aplicaciones por ciclo</p>
                </div>
                <div class="text-right">
                  <span class="font-mono text-base font-bold text-red-600 block">
                    {{ intersection().realtime_data?.all_red_time }}s
                  </span>
                  <span class="text-[9px] text-muted-foreground">
                    {{ (intersection().realtime_data?.all_red_time || 0) * 2 }}s total
                  </span>
                </div>
              </div>

              <!-- Duración total del ciclo -->
              <div class="mt-3 pt-3 border-t flex items-center justify-between">
                <p class="text-[10px] text-muted-foreground">Duración total del ciclo</p>
                <span class="font-mono text-sm font-bold">{{ totalCycleDuration() }}s</span>
              </div>
            </div>
          </div>

          <!-- COL 3: Próximo ciclo + Sincronización -->
          <div class="flex flex-col gap-4">
            <!-- Estrategia próximo ciclo -->
            <div class="border rounded-md p-4 flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Estrategia Próximo Ciclo
                </p>
                <span
                  class="text-[10px] font-medium px-2 py-1 border uppercase leading-none rounded-sm"
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

              <!-- S1 próximo -->
              <div class="border rounded-sm p-3 flex items-center gap-3">
                <div
                  class="h-12 w-12 border flex items-center justify-center font-mono text-2xl font-bold bg-muted/30 shrink-0 rounded-sm"
                >
                  {{ intersection().realtime_data?.next_semaforo1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold leading-none">Fase A — S1</p>
                  <p class="text-[10px] text-muted-foreground mt-1">{{ streetLabelA() }}</p>
                  <div class="mt-2 flex items-center gap-1.5">
                    <div class="h-1.5 rounded-full bg-emerald-500/30 flex-1 overflow-hidden">
                      <div
                        class="h-full bg-emerald-500 rounded-full"
                        [style.width.%]="nextS1Percentage()"
                      ></div>
                    </div>
                    <span class="text-[9px] text-muted-foreground font-mono"
                      >{{ nextS1Percentage() }}%</span
                    >
                  </div>
                </div>
                <span class="text-xs text-muted-foreground font-mono shrink-0"
                  >{{ intersection().realtime_data?.next_semaforo1 }}s</span
                >
              </div>

              <!-- S2 próximo -->
              <div class="border rounded-sm p-3 flex items-center gap-3">
                <div
                  class="h-12 w-12 border flex items-center justify-center font-mono text-2xl font-bold bg-muted/30 shrink-0 rounded-sm"
                >
                  {{ intersection().realtime_data?.next_semaforo2 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold leading-none">Fase B — S2</p>
                  <p class="text-[10px] text-muted-foreground mt-1">{{ streetLabelB() }}</p>
                  <div class="mt-2 flex items-center gap-1.5">
                    <div class="h-1.5 rounded-full bg-emerald-500/30 flex-1 overflow-hidden">
                      <div
                        class="h-full bg-emerald-500 rounded-full"
                        [style.width.%]="nextS2Percentage()"
                      ></div>
                    </div>
                    <span class="text-[9px] text-muted-foreground font-mono"
                      >{{ nextS2Percentage() }}%</span
                    >
                  </div>
                </div>
                <span class="text-xs text-muted-foreground font-mono shrink-0"
                  >{{ intersection().realtime_data?.next_semaforo2 }}s</span
                >
              </div>

              <!-- Comparativa ciclo actual vs próximo -->
              <div class="border-t pt-3">
                <p
                  class="text-[9px] font-medium uppercase text-muted-foreground tracking-wider mb-2"
                >
                  Comparativa actual vs próximo
                </p>
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-2 text-[10px]">
                    <span class="text-muted-foreground w-16 shrink-0">S1</span>
                    <span class="font-mono font-semibold"
                      >{{ intersection().realtime_data?.semaforo1_verde }}s</span
                    >
                    <span class="text-muted-foreground">→</span>
                    <span class="font-mono font-semibold"
                      >{{ intersection().realtime_data?.next_semaforo1 }}s</span
                    >
                    <span
                      class="ml-auto text-[9px] font-semibold"
                      [class.text-emerald-600]="
                        (intersection().realtime_data?.next_semaforo1 || 0) >
                        (intersection().realtime_data?.semaforo1_verde || 0)
                      "
                      [class.text-red-500]="
                        (intersection().realtime_data?.next_semaforo1 || 0) <
                        (intersection().realtime_data?.semaforo1_verde || 0)
                      "
                      [class.text-muted-foreground]="
                        (intersection().realtime_data?.next_semaforo1 || 0) ===
                        (intersection().realtime_data?.semaforo1_verde || 0)
                      "
                    >
                      {{ s1Delta() }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-[10px]">
                    <span class="text-muted-foreground w-16 shrink-0">S2</span>
                    <span class="font-mono font-semibold"
                      >{{ intersection().realtime_data?.semaforo2_verde }}s</span
                    >
                    <span class="text-muted-foreground">→</span>
                    <span class="font-mono font-semibold"
                      >{{ intersection().realtime_data?.next_semaforo2 }}s</span
                    >
                    <span
                      class="ml-auto text-[9px] font-semibold"
                      [class.text-emerald-600]="
                        (intersection().realtime_data?.next_semaforo2 || 0) >
                        (intersection().realtime_data?.semaforo2_verde || 0)
                      "
                      [class.text-red-500]="
                        (intersection().realtime_data?.next_semaforo2 || 0) <
                        (intersection().realtime_data?.semaforo2_verde || 0)
                      "
                      [class.text-muted-foreground]="
                        (intersection().realtime_data?.next_semaforo2 || 0) ===
                        (intersection().realtime_data?.semaforo2_verde || 0)
                      "
                    >
                      {{ s2Delta() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Eficiencia del ciclo -->
            <div class="border rounded-md p-4 flex flex-col gap-3">
              <p class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Eficiencia del ciclo
              </p>

              <div class="flex flex-col gap-2.5">
                <!-- Verde efectivo -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] text-muted-foreground">Tiempo verde efectivo</span>
                    <span class="text-[10px] font-mono font-semibold"
                      >{{ greenEfficiency() }}%</span
                    >
                  </div>
                  <div class="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      class="h-full bg-emerald-500 rounded-full"
                      [style.width.%]="greenEfficiency()"
                    ></div>
                  </div>
                </div>

                <!-- Overhead all-red -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] text-muted-foreground">Overhead All-Red</span>
                    <span class="text-[10px] font-mono font-semibold">{{ allRedOverhead() }}%</span>
                  </div>
                  <div class="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      class="h-full bg-red-500 rounded-full"
                      [style.width.%]="allRedOverhead()"
                    ></div>
                  </div>
                </div>

                <!-- Balance S1/S2 -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] text-muted-foreground">Balance S1 / S2</span>
                    <span class="text-[10px] font-mono font-semibold"
                      >{{ s1Percentage() }} / {{ s2Percentage() }}</span
                    >
                  </div>
                  <div class="h-1.5 bg-muted rounded-full overflow-hidden flex">
                    <div class="h-full bg-emerald-500" [style.width.%]="s1BalancePercent()"></div>
                    <div class="h-full bg-emerald-700" [style.flex]="1"></div>
                  </div>
                </div>
              </div>

              <div class="border-t pt-2.5 mt-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-muted-foreground">Ciclo completo</span>
                  <span class="font-mono text-xs font-bold">{{ totalCycleDuration() }}s</span>
                </div>
              </div>
            </div>
          </div>
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
    return new Date(lastSeen * 1000).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  });

  totalCycleDuration = computed(() => {
    const d = this.intersection().realtime_data;
    if (!d) return 0;
    return (d.semaforo1_verde || 0) + (d.semaforo2_verde || 0) + (d.all_red_time || 0) * 2;
  });

  s1Percentage = computed(() => {
    const total = this.totalCycleDuration();
    if (!total) return 0;
    return Math.round(((this.intersection().realtime_data?.semaforo1_verde || 0) / total) * 100);
  });

  s2Percentage = computed(() => {
    const total = this.totalCycleDuration();
    if (!total) return 0;
    return Math.round(((this.intersection().realtime_data?.semaforo2_verde || 0) / total) * 100);
  });

  s1BalancePercent = computed(() => {
    const s1 = this.intersection().realtime_data?.semaforo1_verde || 0;
    const s2 = this.intersection().realtime_data?.semaforo2_verde || 0;
    const total = s1 + s2;
    if (!total) return 50;
    return Math.round((s1 / total) * 100);
  });

  greenEfficiency = computed(() => {
    const total = this.totalCycleDuration();
    if (!total) return 0;
    const d = this.intersection().realtime_data;
    const greenTotal = (d?.semaforo1_verde || 0) + (d?.semaforo2_verde || 0);
    return Math.round((greenTotal / total) * 100);
  });

  allRedOverhead = computed(() => {
    const total = this.totalCycleDuration();
    if (!total) return 0;
    const d = this.intersection().realtime_data;
    const arTotal = (d?.all_red_time || 0) * 2;
    return Math.round((arTotal / total) * 100);
  });

  nextS1Percentage = computed(() => {
    const d = this.intersection().realtime_data;
    if (!d) return 0;
    const next1 = d.next_semaforo1 || 0;
    const next2 = d.next_semaforo2 || 0;
    const total = next1 + next2 + (d.all_red_time || 0) * 2;
    if (!total) return 0;
    return Math.round((next1 / total) * 100);
  });

  nextS2Percentage = computed(() => {
    const d = this.intersection().realtime_data;
    if (!d) return 0;
    const next1 = d.next_semaforo1 || 0;
    const next2 = d.next_semaforo2 || 0;
    const total = next1 + next2 + (d.all_red_time || 0) * 2;
    if (!total) return 0;
    return Math.round((next2 / total) * 100);
  });

  cycleProgress = computed(() => {
    const restante = this.intersection().realtime_data?.ciclo_restante_s || 0;
    const total = this.totalCycleDuration();
    if (!total) return 0;
    return Math.round((restante / total) * 100);
  });

  phaseProgress = computed(() => {
    const restante = this.intersection().realtime_data?.estado_restante_s || 0;
    const estado = this.intersection().realtime_data?.estado || '';
    let phaseDuration = 0;
    if (estado.includes('S1') || estado.includes('S2')) {
      if (estado.includes('VERDE')) {
        phaseDuration = estado.includes('S1')
          ? this.intersection().realtime_data?.semaforo1_verde || 0
          : this.intersection().realtime_data?.semaforo2_verde || 0;
      } else {
        phaseDuration = Math.max(restante, 5);
      }
    } else if (estado === 'ALL_RED') {
      phaseDuration = this.intersection().realtime_data?.all_red_time || 0;
    }
    if (!phaseDuration) return 0;
    return Math.round((restante / phaseDuration) * 100);
  });

  isGreenState = computed(() => {
    const estado = this.intersection().realtime_data?.estado || '';
    return estado.includes('VERDE');
  });

  isYellowState = computed(() => {
    const estado = this.intersection().realtime_data?.estado || '';
    return estado.includes('AMARILLO');
  });

  isRedState = computed(() => {
    const estado = this.intersection().realtime_data?.estado || '';
    return estado.includes('ROJO') || estado === 'ALL_RED';
  });

  stateDescription = computed(() => {
    const estado = this.intersection().realtime_data?.estado;
    switch (estado) {
      case 'S1_VERDE':
        return 'Calle A tiene paso libre';
      case 'S2_VERDE':
        return 'Calle B tiene paso libre';
      case 'S1_AMARILLO':
        return 'Calle A preparando cierre';
      case 'S2_AMARILLO':
        return 'Calle B preparando cierre';
      case 'S1_ROJO':
        return 'Calle A detenida';
      case 'S2_ROJO':
        return 'Calle B detenida';
      case 'S1_ROJO_AMARILLO':
        return 'Calle A preparando apertura';
      case 'S2_ROJO_AMARILLO':
        return 'Calle B preparando apertura';
      case 'ALL_RED':
        return 'Pausa de seguridad activa';
      default:
        return 'Sin información';
    }
  });

  nextPhaseDescription = computed(() => {
    const estado = this.intersection().realtime_data?.estado;
    switch (estado) {
      case 'S1_VERDE':
        return 'S1 Amarillo → All-Red';
      case 'S1_AMARILLO':
        return 'All-Red → S2 Verde';
      case 'S2_VERDE':
        return 'S2 Amarillo → All-Red';
      case 'S2_AMARILLO':
        return 'All-Red → S1 Verde';
      case 'ALL_RED':
        return 'Cambio de fase verde';
      default:
        return 'Desconocido';
    }
  });

  s1Delta = computed(() => {
    const current = this.intersection().realtime_data?.semaforo1_verde || 0;
    const next = this.intersection().realtime_data?.next_semaforo1 || 0;
    const diff = next - current;
    if (diff === 0) return '=';
    return diff > 0 ? `+${diff}s` : `${diff}s`;
  });

  s2Delta = computed(() => {
    const current = this.intersection().realtime_data?.semaforo2_verde || 0;
    const next = this.intersection().realtime_data?.next_semaforo2 || 0;
    const diff = next - current;
    if (diff === 0) return '=';
    return diff > 0 ? `+${diff}s` : `${diff}s`;
  });

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

  getPhaseClass(semaphore: 'S1' | 'S2'): string {
    if (this.isGreen(semaphore)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (this.isYellow(semaphore)) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (this.isRed(semaphore)) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-muted text-muted-foreground border-border';
  }

  getPhaseLabel(semaphore: 'S1' | 'S2'): string {
    if (this.isGreen(semaphore)) return 'Verde';
    if (this.isYellow(semaphore)) return 'Ambar';
    if (this.isRed(semaphore)) return 'Rojo';
    return '—';
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

  streetLabelA = computed(() => {
    const i = this.intersection();
    return i.street_a_name?.trim() || `Calle ${i.street_a_id}`;
  });

  streetLabelB = computed(() => {
    const i = this.intersection();
    return i.street_b_name?.trim() || `Calle ${i.street_b_id}`;
  });

  timerOffset = computed(() => {
    const restante = this.intersection().realtime_data?.estado_restante_s || 0;
    const max = Math.max(60, restante);
    return 201 - (restante / max) * 201;
  });
}
