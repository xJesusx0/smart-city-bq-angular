import { Pipe, PipeTransform } from '@angular/core';
import { CircleCheck, CircleX } from 'lucide-angular';

@Pipe({
  name: 'trafficLightStatus',
  standalone: true
})
export class TrafficLightStatusPipe implements PipeTransform {
  transform(isActive: boolean | null | undefined, type: 'text' | 'class' | 'icon'): any {
    if (isActive) {
      if (type === 'text') return 'Activo';
      if (type === 'class') return 'text-emerald-600 dark:text-emerald-400';
      if (type === 'icon') return CircleCheck;
    } else {
      if (type === 'text') return 'Inactivo';
      if (type === 'class') return 'text-muted-foreground';
      if (type === 'icon') return CircleX;
    }
  }
}
