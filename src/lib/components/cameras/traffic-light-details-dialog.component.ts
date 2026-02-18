import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmDialogHeaderComponent, HlmDialogFooterComponent, HlmDialogTitleDirective, HlmDialogDescriptionDirective } from '../ui/dialog';
import { HlmButtonDirective } from '../ui/button';
import { LucideAngularModule, Info } from 'lucide-angular';
import type { components } from '../../__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Component({
    selector: 'app-traffic-light-details-dialog',
    standalone: true,
    imports: [
        CommonModule,
        HlmDialogHeaderComponent,
        HlmDialogFooterComponent,
        HlmDialogTitleDirective,
        HlmDialogDescriptionDirective,
        HlmButtonDirective,
        LucideAngularModule,
    ],
    template: `
    <div class="sm:max-w-[425px]">
      <div hlmDialogHeader>
        <div class="flex items-center gap-2">
          <lucide-icon [name]="InfoIcon" class="h-5 w-5 text-primary"></lucide-icon>
          <h3 hlmDialogTitle>Detalles del Semáforo</h3>
        </div>
        <p hlmDialogDescription>Información detallada sobre el dispositivo seleccionado.</p>
      </div>
      
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-start gap-4">
          <span class="text-sm font-medium text-right">Nombre:</span>
          <span class="col-span-3 text-sm">{{ trafficLight()?.name }}</span>
        </div>
        <div class="grid grid-cols-4 items-start gap-4">
          <span class="text-sm font-medium text-right">ID:</span>
          <span class="col-span-3 text-sm font-mono">{{ trafficLight()?.id }}</span>
        </div>
        <div class="grid grid-cols-4 items-start gap-4">
          <span class="text-sm font-medium text-right">Ubicación:</span>
          <span class="col-span-3 text-sm">
            {{ trafficLight()?.latitude }}, {{ trafficLight()?.longitude }}
          </span>
        </div>
      </div>
      
      <div hlmDialogFooter>
        <button hlmBtn variant="outline" (click)="close.emit()">Cerrar</button>
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
