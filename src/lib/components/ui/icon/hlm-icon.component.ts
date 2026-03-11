import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { HlmIconDirective } from './hlm-icon.directive';
import { hlm } from '../../../utils';

import { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-icon',
  standalone: true,
  imports: [NgIcon, HlmIconDirective],
  template: `
    <ng-icon
      hlm
      [name]="name()"
      [size]="size()"
      [class]="_computedClass()"
      [strokeWidth]="strokeWidth()"
      [color]="color()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmIconComponent {
  public readonly name = input.required<string>();
  public readonly size = input<string>('base');
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly strokeWidth = input<string | number>();
  public readonly color = input<string>();

  protected readonly _computedClass = computed(() => {
    return hlm('inline-flex items-center justify-center', this.userClass());
  });
}
