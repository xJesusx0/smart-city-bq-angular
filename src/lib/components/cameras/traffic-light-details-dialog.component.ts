import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import {
  HlmDialogHeaderComponent,
  HlmDialogFooterComponent,
  HlmDialogTitleDirective,
  HlmDialogDescriptionDirective,
} from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { LucideAngularModule, Info } from 'lucide-angular';
import type { components } from '../../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Component({
  selector: 'app-traffic-light-details-dialog',
  standalone: true,
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmButtonDirective,
    LucideAngularModule,
  ],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      (click)="close.emit()"
    >
      <div
        class="bg-background relative z-50 grid w-full max-w-[425px] gap-4 rounded-lg border p-6 shadow-xl mx-4"
        (click)="$event.stopPropagation()"
      >
        <hlm-dialog-header>
          <div class="flex items-center gap-2">
            <lucide-icon [name]="InfoIcon" class="h-5 w-5 text-primary"></lucide-icon>
            <h3 hlmDialogTitle>Detalles del Semáforo</h3>
          </div>
          <p hlmDialogDescription>Información detallada sobre el dispositivo seleccionado.</p>
        </hlm-dialog-header>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-start gap-4">
            <span class="text-sm font-medium text-right font-semibold">Nombre:</span>
            <span class="col-span-3 text-sm">{{ trafficLight()?.name }}</span>
          </div>
          <div class="grid grid-cols-4 items-start gap-4">
            <span class="text-sm font-medium text-right font-semibold">ID:</span>
            <span class="col-span-3 text-sm font-mono">{{ trafficLight()?.id }}</span>
          </div>
          <div class="grid grid-cols-4 items-start gap-4">
            <span class="text-sm font-medium text-right font-semibold">Ubicación:</span>
            <span class="col-span-3 text-sm">
              {{ trafficLight()?.latitude }}, {{ trafficLight()?.longitude }}
            </span>
          </div>
        </div>

        <hlm-dialog-footer>
          <button hlmBtn variant="outline" (click)="close.emit()">Cerrar</button>
        </hlm-dialog-footer>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficLightDetailsDialogComponent {
  trafficLight = input<TrafficLight | null>(null);
  close = output<void>();

  readonly InfoIcon = Info;
}
