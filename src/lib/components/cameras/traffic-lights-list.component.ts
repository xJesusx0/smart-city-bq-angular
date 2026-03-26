import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TrafficLightStatusPipe } from './traffic-light-status.pipe';
import { HlmButtonDirective } from '../ui/button';
import { HlmInputDirective } from '../ui/input';
import { HlmBadgeDirective } from '../ui/badge';
import {
  LucideAngularModule,
  Eye,
  Search,
  TrafficCone,
  CheckCircle2,
  XCircle,
  Hash,
  CircleX,
  CircleCheck,
} from 'lucide-angular';
import type { components } from '../../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Component({
  selector: 'app-traffic-lights-list',
  imports: [HlmButtonDirective, HlmInputDirective, LucideAngularModule, DatePipe, TrafficLightStatusPipe],
  styles: [
    `
      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .row-animate {
        animation: fadeSlideIn 0.2s ease both;
      }
    `,
  ],
  template: `
    <div class="space-y-4">
      <!-- Search bar -->
      <div class="relative max-w-sm">
        <lucide-icon
          [name]="SearchIcon"
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        ></lucide-icon>
        <input
          hlmInput
          placeholder="Buscar por nombre o ID..."
          [value]="searchQuery()"
          (input)="onSearchInput($event)"
          class="pl-9 w-full"
        />
      </div>

      <!-- Table -->
      <div class="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/40">
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16"
              >
                <div class="flex items-center gap-1">
                  <lucide-icon [name]="HashIcon" class="h-3 w-3"></lucide-icon>
                  ID
                </div>
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell"
              >
                Intersección
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell"
              >
                Estado
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell"
              >
                Creado
              </th>
              <th
                class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            @for (item of filteredData(); track item.id; let i = $index) {
              <tr
                class="row-animate hover:bg-muted/40 transition-colors group"
                [style.animation-delay]="i * 30 + 'ms'"
              >
                <!-- ID -->
                <td class="px-4 py-3">
                  <span
                    class="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                  >
                    #{{ item.id }}
                  </span>
                </td>

                <!-- Name -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div
                      class="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0"
                    >
                      <lucide-icon
                        [name]="TrafficConeIcon"
                        class="h-3.5 w-3.5 text-primary"
                      ></lucide-icon>
                    </div>
                    <span class="font-medium leading-tight">{{ item.name ?? '—' }}</span>
                  </div>
                </td>

                <!-- Intersection -->
                <td class="px-4 py-3 hidden md:table-cell">
                  @if (item.intersection_id) {
                    <span class="text-xs font-mono text-muted-foreground">
                      INT-{{ item.intersection_id }}
                    </span>
                  } @else {
                    <span class="text-xs text-muted-foreground/50">—</span>
                  }
                </td>

                <!-- Status -->
                <td class="px-4 py-3 hidden sm:table-cell">
                  <span
                    class="inline-flex items-center gap-1.5 text-xs font-medium"
                    [class]="item.active | trafficLightStatus:'class'"
                  >
                    <lucide-icon [name]="item.active | trafficLightStatus:'icon'" class="h-3.5 w-3.5"></lucide-icon>
                    {{ item.active | trafficLightStatus:'text' }}
                  </span>
                </td>

                <!-- Created at -->
                <td class="px-4 py-3 hidden lg:table-cell">
                  <span class="text-xs text-muted-foreground">
                    {{ (item.created_at | date:'dd MMM yyyy') ?? '—' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-3 text-right">
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="viewDetails.emit(item)"
                    title="Ver detalles"
                    class="opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <lucide-icon [name]="EyeIcon" class="h-4 w-4"></lucide-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-4 py-16 text-center">
                  <div class="flex flex-col items-center gap-3 text-muted-foreground">
                    <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <lucide-icon [name]="SearchIcon" class="h-5 w-5"></lucide-icon>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-foreground">Sin resultados</p>
                      <p class="text-xs">Intenta con otro nombre o ID</p>
                    </div>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Footer count -->
      <div class="flex items-center justify-between px-1">
        <p class="text-xs text-muted-foreground">
          @if (searchQuery()) {
            <span class="font-medium text-foreground">{{ filteredData().length }}</span>
            de {{ data().length }} semáforos encontrados
          } @else {
            {{ data().length }} semáforos en total
          }
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightsListComponent {
  data = input<TrafficLight[]>([]);
  viewDetails = output<TrafficLight>();

  searchQuery = signal('');

  filteredData = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.data();
    return this.data().filter(
      (tl) => tl.name?.toLowerCase().includes(query) || tl.id?.toString().includes(query),
    );
  });

  readonly EyeIcon = Eye;
  readonly SearchIcon = Search;
  readonly TrafficConeIcon = TrafficCone;
  readonly CheckIcon = CircleCheck;
  readonly XCircleIcon = CircleX;
  readonly HashIcon = Hash;

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
