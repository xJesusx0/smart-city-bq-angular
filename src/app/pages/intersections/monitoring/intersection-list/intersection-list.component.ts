import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionWithStatus } from '../../../../../lib/api/semaphores.service';
import { HlmButtonDirective } from '../../../../../lib/components/ui/button/hlm-button.directive';
import { HlmIconComponent } from '../../../../../lib/components/ui/icon/hlm-icon.component';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideRadio, lucideCircle } from '@ng-icons/lucide';
import { HlmBadgeDirective } from '../../../../../lib/components/ui/badge/hlm-badge.directive';

@Component({
  selector: 'app-intersection-list',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, HlmIconComponent, HlmBadgeDirective],
  providers: [provideIcons({ lucideChevronRight, lucideRadio, lucideCircle })],
  template: `
    <div class="w-full">
      <!-- Header row -->
      <div class="grid grid-cols-[64px_1fr_120px_160px_80px] border-b px-4 py-2">
        <span class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >ID</span
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
        <span
          class="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right"
          >Ver</span
        >
      </div>

      @for (intersection of intersections(); track intersection.id) {
        <div
          class="grid grid-cols-[64px_1fr_120px_160px_80px] items-center px-4 py-3.5 border-b hover:bg-accent/50 transition-colors duration-150 cursor-pointer group"
          (click)="viewDetails.emit(intersection)"
        >
          <!-- ID -->
          <span class="font-mono text-xs font-medium text-muted-foreground">
            #{{ intersection.id }}
          </span>

          <!-- Nombre / calles -->
          <div class="flex flex-col gap-0.5 min-w-0">
            <span class="text-sm font-semibold truncate leading-tight">
              {{ intersection.street_a_id }}
            </span>
            <span class="text-[11px] text-muted-foreground truncate leading-tight">
              ✕ {{ intersection.street_b_id }}
            </span>
          </div>

          <!-- Conexión -->
          <div class="flex items-center gap-2">
            @if (intersection.realtime_data) {
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"
                ></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span class="text-[11px] font-medium text-emerald-600">Online</span>
            } @else {
              <span class="flex h-2 w-2 rounded-full bg-muted-foreground/30"></span>
              <span class="text-[11px] font-medium text-muted-foreground">Offline</span>
            }
          </div>

          <!-- Estado -->
          <div>
            <span
              hlmBadge
              variant="outline"
              class="rounded-sm text-[10px] font-mono font-semibold uppercase"
              [class]="getStateBadgeClass(intersection.realtime_data?.estado)"
            >
              {{ intersection.realtime_data?.estado ?? 'SIN SEÑAL' }}
            </span>
          </div>

          <!-- Acción -->
          <div class="flex justify-end">
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <hlm-icon name="lucideChevronRight" class="h-4 w-4" />
            </button>
          </div>
        </div>
      } @empty {
        <div class="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <hlm-icon name="lucideRadio" class="h-8 w-8 opacity-20" />
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
}
