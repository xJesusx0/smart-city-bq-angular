import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  untracked,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { SemaphoresService, IntersectionWithStatus } from '../../../../lib/api/semaphores.service';
import { IntersectionListComponent } from './intersection-list/intersection-list.component';
import { IntersectionDetailComponent } from './intersection-detail/intersection-detail.component';
import { HlmCardImports } from '../../../../lib/components/ui/card';
import { HlmIconComponent } from '../../../../lib/components/ui/icon/hlm-icon.component';
import { HlmButtonDirective } from '../../../../lib/components/ui/button/hlm-button.directive';
import { provideIcons } from '@ng-icons/core';
import {
  lucideRefreshCcw,
  lucideAlertCircle,
  lucideWifi,
  lucideWifiOff,
  lucideActivity,
  lucideCheckCircle2,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-intersection-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    IntersectionListComponent,
    IntersectionDetailComponent,
    ...HlmCardImports,
    HlmIconComponent,
    HlmButtonDirective,
  ],
  providers: [
    provideIcons({
      lucideRefreshCcw,
      lucideAlertCircle,
      lucideWifi,
      lucideWifiOff,
      lucideActivity,
      lucideCheckCircle2,
    }),
  ],
  template: `
    <div class="p-6 max-w-7xl mx-auto flex flex-col gap-5">
      <!-- ── HEADER ── -->
      <header class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-4">
        <div>
          <h1 class="text-lg font-semibold tracking-tight">Monitoreo Urbano</h1>
          <p class="text-[11px] text-muted-foreground mt-0.5">
            Controladores de tráfico · Tiempo real
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          @if (intersectionsQuery.isFetching()) {
            <div class="flex items-center gap-1.5 border rounded-md px-3 py-2 bg-muted/30">
              <hlm-icon
                name="lucideRefreshCcw"
                size="12px"
                class="animate-spin text-muted-foreground"
              />
              <span class="text-[11px] font-medium text-muted-foreground leading-none"
                >Sincronizando</span
              >
            </div>
          } @else {
            <div class="flex items-center gap-1.5 border rounded-md px-3 py-2 bg-muted/30">
              <span class="relative flex h-1.5 w-1.5 shrink-0">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"
                ></span>
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span class="text-[11px] font-medium text-muted-foreground leading-none">
                {{ lastUpdate() | date: 'HH:mm:ss' }}
              </span>
            </div>
          }
        </div>
      </header>

      <!-- ── STATS SUMMARY ── -->
      @if (intersectionsQuery.data() && !selectedIntersection()) {
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="border rounded-md p-3 flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideActivity" size="12px" class="text-muted-foreground" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Total
              </p>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="font-mono text-2xl font-bold leading-none">{{
                totalIntersections()
              }}</span>
              <span class="text-[10px] text-muted-foreground">intersecciones</span>
            </div>
          </div>

          <div class="border rounded-md p-3 flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideWifi" size="12px" class="text-emerald-500" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Online
              </p>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="font-mono text-2xl font-bold text-emerald-600 leading-none">{{
                onlineCount()
              }}</span>
              <span class="text-[10px] text-muted-foreground">/ {{ totalIntersections() }}</span>
            </div>
            <div class="h-1 bg-muted rounded-full overflow-hidden mt-0.5">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                [style.width.%]="onlinePercent()"
              ></div>
            </div>
          </div>

          <div class="border rounded-md p-3 flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideWifiOff" size="12px" class="text-muted-foreground" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Offline
              </p>
            </div>
            <div class="flex items-baseline gap-1">
              <span
                class="font-mono text-2xl font-bold leading-none"
                [class.text-red-500]="offlineCount() > 0"
                [class.text-muted-foreground]="offlineCount() === 0"
                >{{ offlineCount() }}</span
              >
              <span class="text-[10px] text-muted-foreground">dispositivos</span>
            </div>
          </div>

          <div class="border rounded-md p-3 flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5">
              <hlm-icon name="lucideCheckCircle2" size="12px" class="text-muted-foreground" />
              <p
                class="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none"
              >
                Red
              </p>
            </div>
            <div class="flex items-baseline gap-1">
              <span
                class="text-sm font-semibold leading-none"
                [class.text-emerald-600]="offlineCount() === 0"
                [class.text-amber-600]="offlineCount() > 0 && offlineCount() < totalIntersections()"
                [class.text-red-500]="offlineCount() === totalIntersections()"
                >{{ networkStatus() }}</span
              >
            </div>
            <p class="text-[10px] text-muted-foreground">{{ onlinePercent() }}% operativa</p>
          </div>
        </div>
      }

      <!-- ── ERROR ── -->
      @if (intersectionsQuery.isError()) {
        <div
          class="flex flex-col items-center justify-center py-24 gap-4 border border-dashed rounded-md"
        >
          <hlm-icon name="lucideAlertCircle" size="28px" class="text-muted-foreground opacity-30" />
          <div class="text-center">
            <p class="text-sm font-semibold">Error de conexión</p>
            <p class="text-xs text-muted-foreground mt-1 max-w-xs">
              No se pudo establecer comunicación con el sistema de semáforos.
            </p>
          </div>
          <button
            hlmBtn
            variant="outline"
            size="sm"
            class="mt-2 flex items-center gap-2 h-8 px-3 text-xs"
            (click)="intersectionsQuery.refetch()"
          >
            <hlm-icon name="lucideRefreshCcw" size="12px" />
            <span class="leading-none">Reintentar</span>
          </button>
        </div>
      }

      <!-- ── LOADING ── -->
      @else if (intersectionsQuery.isPending()) {
        <div class="flex flex-col gap-3">
          @for (i of [1, 2, 3, 4]; track i) {
            <div
              class="h-12 bg-muted/40 animate-pulse rounded-md border"
              [style.opacity]="1 - i * 0.15"
            ></div>
          }
        </div>
      }

      <!-- ── CONTENT ── -->
      @else {
        <main>
          @if (!selectedIntersection()) {
            <div class="border rounded-md overflow-hidden">
              <app-intersection-list
                [intersections]="intersectionsQuery.data() || []"
                (viewDetails)="selectedIntersection.set($event)"
              />
            </div>
          } @else {
            <app-intersection-detail
              [intersection]="selectedIntersection()!"
              (back)="selectedIntersection.set(null)"
            />
          }
        </main>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntersectionMonitoringComponent {
  private semaphoresService = inject(SemaphoresService);

  selectedIntersection = signal<IntersectionWithStatus | null>(null);
  lastUpdate = signal(new Date());

  intersectionsQuery = injectQuery(() => ({
    queryKey: ['intersections-monitoring'],
    queryFn: () => this.semaphoresService.getIntersectionsMonitoring(),
    refetchInterval: 5000,
  }));

  totalIntersections = computed(() => this.intersectionsQuery.data()?.length ?? 0);
  onlineCount = computed(
    () => this.intersectionsQuery.data()?.filter((i) => !!i.realtime_data).length ?? 0,
  );
  offlineCount = computed(() => this.totalIntersections() - this.onlineCount());
  onlinePercent = computed(() => {
    const total = this.totalIntersections();
    if (!total) return 0;
    return Math.round((this.onlineCount() / total) * 100);
  });
  networkStatus = computed(() => {
    const offline = this.offlineCount();
    const total = this.totalIntersections();
    if (offline === 0) return 'Óptima';
    if (offline === total) return 'Sin señal';
    if (offline / total < 0.25) return 'Degradada';
    return 'Crítica';
  });

  constructor() {
    effect(() => {
      const data = this.intersectionsQuery.data();
      if (data) {
        untracked(() => {
          this.lastUpdate.set(new Date());
          const selected = this.selectedIntersection();
          if (selected) {
            const fresh = data.find((i) => i.id === selected.id);
            if (fresh) this.selectedIntersection.set(fresh);
          }
        });
      }
    });
  }
}
