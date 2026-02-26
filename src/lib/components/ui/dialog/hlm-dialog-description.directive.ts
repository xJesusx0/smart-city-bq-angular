import { Directive } from '@angular/core';
import { classes } from '../../../utils';

@Directive({
  selector: '[hlmDialogDescription]',
  host: {
    'data-slot': 'dialog-description',
  },
})
export class HlmDialogDescriptionDirective {
  constructor() {
    classes(() => 'text-muted-foreground text-sm');
  }
}
