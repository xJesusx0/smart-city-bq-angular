import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  untracked,
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
import { lucideRefreshCcw, lucideAlertCircle, lucideCheckCircle2 } from '@ng-icons/lucide';

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
  providers: [provideIcons({ lucideRefreshCcw, lucideAlertCircle, lucideCheckCircle2 })],
  template: `
    <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6">

      <!-- ── HEADER ── -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h1 class="text-lg font-semibold tracking-tight">Monitoreo Urbano</h1>
          <p class="text-[11px] text-muted-foreground mt-0.5">
            Controladores de tráfico · Tiempo real
          </p>
        </div>

        <!-- Status badge -->
        <div class="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/30 self-start sm:self-auto">
          @if (intersectionsQuery.isFetching()) {
            <hlm-icon name="lucideRefreshCcw" class="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
            <span class="text-[11px] font-medium text-muted-foreground leading-none">Sincronizando</span>
          } @else {
            <span class="relative flex h-1.5 w-1.5 shrink-0">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"></span>
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span class="text-[11px] font-medium text-muted-foreground leading-none">
              {{ lastUpdate() | date: 'HH:mm:ss' }}
            </span>
          }
        </div>
      </header>

      <!-- ── ERROR ── -->
      @if (intersectionsQuery.isError()) {
        <div class="flex flex-col items-center justify-center py-24 gap-4 border border-dashed rounded-md">
          <hlm-icon name="lucideAlertCircle" class="h-8 w-8 text-muted-foreground/30" />
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
            <hlm-icon name="lucideRefreshCcw" class="h-3.5 w-3.5 shrink-0" />
            <span class="leading-none">Reintentar</span>
          </button>
        </div>
      }

      <!-- ── LOADING ── -->
      @else if (intersectionsQuery.isPending()) {
        <div class="flex flex-col gap-3">
          <div class="h-10 bg-muted/40 animate-pulse rounded-md border"></div>
          <div class="h-10 bg-muted/30 animate-pulse rounded-md border"></div>
          <div class="h-10 bg-muted/30 animate-pulse rounded-md border"></div>
          <div class="h-10 bg-muted/20 animate-pulse rounded-md border"></div>
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
  styles: `:host { display: block; width: 100%; min-height: 100vh; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntersectionMonitoringComponent {
  private semaphoresService = inject(SemaphoresService);

  selectedIntersection = signal<IntersectionWithStatus | null>(null);
  lastUpdate = signal(new Date());

  intersectionsQuery = injectQuery(() => ({
    queryKey: ['intersections-monitoring'],
    queryFn: () => this.semaphoresService.getIntersectionsMonitoring(),
    refetchInterval: 2000,
  }));

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
