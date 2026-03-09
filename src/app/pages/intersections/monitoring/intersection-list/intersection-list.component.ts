import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionWithStatus } from '../../../../../lib/api/semaphores.service';
import { HlmButtonDirective } from '../../../../../lib/components/ui/button/hlm-button.directive';

@Component({
  selector: 'app-intersection-list',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left border-collapse">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="p-4 font-semibold uppercase tracking-wider">ID</th>
            <th class="p-4 font-semibold uppercase tracking-wider">ID Calle A</th>
            <th class="p-4 font-semibold uppercase tracking-wider">ID Calle B</th>
            <th class="p-4 font-semibold uppercase tracking-wider">Conexión</th>
            <th class="p-4 font-semibold uppercase tracking-wider">Estado Actual</th>
            <th class="p-4 font-semibold uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (intersection of intersections(); track intersection.id) {
            <tr class="border-b hover:bg-muted/30 transition-colors">
              <td class="p-4 font-medium">{{ intersection.id }}</td>
              <td class="p-4 text-muted-foreground">{{ intersection.street_a_id }}</td>
              <td class="p-4 text-muted-foreground">{{ intersection.street_b_id }}</td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  @if (intersection.realtime_data) {
                    <span class="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    <span class="text-xs font-bold uppercase text-green-600">EN LÍNEA</span>
                  } @else {
                    <span class="flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                    <span class="text-xs font-bold uppercase text-red-600">DESCONECTADO</span>
                  }
                </div>
              </td>
              <td class="p-4">
                <span 
                  class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset uppercase"
                  [ngClass]="getStateBadgeClass(intersection.realtime_data?.estado)"
                >
                  {{ intersection.realtime_data?.estado || 'SIN DATOS' }}
                </span>
              </td>
              <td class="p-4">
                <button hlmBtn variant="outline" size="sm" (click)="viewDetails.emit(intersection)">
                  Ver Detalles
                </button>
              </td>
            </tr>
          } @empty {
             <tr>
              <td colspan="6" class="p-8 text-center text-muted-foreground italic">
                No se encontraron intersecciones para mostrar.
              </td>
            </tr>
          }
        </tbody>
      </table>
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
