import { Directive } from '@angular/core';
import { classes } from '../../../utils';

@Directive({
  selector: '[hlmDialogTitle]',
  host: {
    'data-slot': 'dialog-title',
  },
})
export class HlmDialogTitleDirective {
  constructor() {
    classes(() => 'text-lg leading-none font-semibold');
  }
}
