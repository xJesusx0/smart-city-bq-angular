import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { HlmIconDirective } from '../icon';
import { classes } from '../../../utils';

@Component({
  selector: 'hlm-select-scroll-up',
  imports: [NgIcon, HlmIconDirective],
  providers: [provideIcons({ lucideChevronUp })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-icon hlm size="sm" class="ml-2" name="lucideChevronUp" /> `,
})
export class HlmSelectScrollUpComponent {
  constructor() {
    classes(() => 'flex cursor-default items-center justify-center py-1');
  }
}
