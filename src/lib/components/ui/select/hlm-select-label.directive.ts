import { computed, Directive, inject } from '@angular/core';
import { BrnSelectLabel } from '@spartan-ng/brain/select';
import { classes } from '../../../utils';
import { HlmSelectContentDirective } from './hlm-select-content.directive';

@Directive({
  selector: '[hlmSelectLabel], hlm-select-label',
  hostDirectives: [BrnSelectLabel],
})
export class HlmSelectLabelDirective {
  private readonly _selectContent = inject(HlmSelectContentDirective);
  private readonly _stickyLabels = computed(() => this._selectContent.stickyLabels());

  constructor() {
    classes(() => [
      'text-muted-foreground px-2 py-1.5 text-xs',
      this._stickyLabels() ? 'bg-popover sticky top-0 z-[2] block' : '',
    ]);
  }
}
