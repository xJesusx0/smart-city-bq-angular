import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { HlmButtonDirective } from '../ui/button';
import { HlmInputDirective } from '../ui/input';
import { LucideAngularModule, Eye } from 'lucide-angular';
import type { components } from '../../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Component({
  selector: 'app-traffic-lights-list',
  imports: [HlmButtonDirective, HlmInputDirective, LucideAngularModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center gap-x-2 py-4">
        <input
          hlmInput
          placeholder="Filtrar por nombre..."
          [value]="searchQuery()"
          (input)="onSearchInput($event)"
          class="max-w-sm"
        />
      </div>

      <div class="rounded-md border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-muted/50 border-b">
            <tr>
              <th class="px-4 py-3 text-left font-medium">ID</th>
              <th class="px-4 py-3 text-left font-medium">Nombre</th>
              <th class="px-4 py-3 text-left font-medium">Tipo</th>
              <th class="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            @for (item of filteredData(); track item.id) {
              <tr class="hover:bg-muted/50 transition-colors">
                <td class="px-4 py-3 font-mono text-xs">{{ item.id }}</td>
                <td class="px-4 py-3 font-medium">{{ item.name }}</td>
                <td class="px-4 py-3 text-muted-foreground uppercase text-xs">Semáforo</td>
                <td class="px-4 py-3 text-right">
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    (click)="viewDetails.emit(item)"
                    title="Ver detalles"
                  >
                    <lucide-icon [name]="EyeIcon" class="h-4 w-4"></lucide-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-4 py-12 text-center text-muted-foreground">
                  No se encontraron resultados
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between py-4">
        <p class="text-sm text-muted-foreground">
          Mostrando {{ filteredData().length }} de {{ data().length }} semáforos
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

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
