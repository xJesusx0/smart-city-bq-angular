import { Component, ChangeDetectionStrategy, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { SemaphoresService, IntersectionWithStatus } from '../../../../lib/api/semaphores.service';
import { IntersectionListComponent } from './intersection-list/intersection-list.component';
import { IntersectionDetailComponent } from './intersection-detail/intersection-detail.component';
import { HlmCardImports } from '../../../../lib/components/ui/card';
import { HlmIconComponent } from '../../../../lib/components/ui/icon/hlm-icon.component';
import { provideIcons } from '@ng-icons/core';
import { lucideRefreshCcw, lucideAlertCircle } from '@ng-icons/lucide';

@Component({
  selector: 'app-intersection-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    IntersectionListComponent,
    IntersectionDetailComponent,
    ...HlmCardImports,
    HlmIconComponent,
  ],
  providers: [provideIcons({ lucideRefreshCcw, lucideAlertCircle })],
  template: `
    <div class="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-primary">Monitoreo de Intersecciones</h1>
          <p class="text-muted-foreground">Estado en tiempo real de los controladores de semáforos.</p>
        </div>
        
        <div class="flex items-center gap-2 text-sm font-medium bg-secondary/50 px-4 py-2 rounded-full border">
          @if (intersectionsQuery.isFetching()) {
            <hlm-icon name="lucideRefreshCcw" class="h-4 w-4 animate-spin text-primary" />
            <span class="text-primary">Actualizando datos...</span>
          } @else {
            <span class="text-muted-foreground">Última actualización: {{ lastUpdate() | date: 'HH:mm:ss' }}</span>
          }
        </div>
      </header>

      @if (intersectionsQuery.isError()) {
        <div class="flex flex-col items-center justify-center p-12 bg-destructive/5 text-destructive rounded-xl border border-destructive/20 shadow-sm">
          <hlm-icon name="lucideAlertCircle" class="h-16 w-16 mb-4 opacity-50" />
          <p class="text-xl font-bold">Error al cargar datos</p>
          <p class="text-muted-foreground mb-6">No pudimos obtener la información de las intersecciones en este momento.</p>
          <button 
            class="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-bold hover:bg-destructive/90 transition-all active:scale-95 shadow-lg shadow-destructive/20"
            (click)="intersectionsQuery.refetch()"
          >
            Reintentar conexión
          </button>
        </div>
      } @else if (intersectionsQuery.isPending()) {
        <div class="flex flex-col gap-6">
          <div class="h-12 bg-muted animate-pulse rounded-lg"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="h-40 bg-muted animate-pulse rounded-xl"></div>
            <div class="h-40 bg-muted animate-pulse rounded-xl"></div>
            <div class="h-40 bg-muted animate-pulse rounded-xl"></div>
          </div>
        </div>
      } @else {
        <main class="transition-all duration-300">
          @if (!selectedIntersection()) {
            <section hlmCard class="overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm">
              <app-intersection-list 
                [intersections]="intersectionsQuery.data() || []" 
                (viewDetails)="selectedIntersection.set($event)"
              />
            </section>
          } @else {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <app-intersection-detail 
                [intersection]="selectedIntersection()!" 
                (back)="selectedIntersection.set(null)"
              />
            </div>
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
      background-color: hsl(var(--background));
      background-image: radial-gradient(at 0% 0%, hsla(var(--primary-foreground), 0.05) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, hsla(var(--primary), 0.03) 0px, transparent 50%);
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

  constructor() {
    effect(() => {
      const data = this.intersectionsQuery.data();
      if (data) {
        untracked(() => {
          this.lastUpdate.set(new Date());
          
          const selected = this.selectedIntersection();
          if (selected) {
            const fresh = data.find(i => i.id === selected.id);
            if (fresh) {
              this.selectedIntersection.set(fresh);
            }
          }
        });
      }
    });
  }
}
