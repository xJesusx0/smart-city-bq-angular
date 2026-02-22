import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';
import { classes } from '../../../utils';

@Directive({
  selector: '[hlmDialogDescription]',
  hostDirectives: [BrnDialogDescription],
  host: {
    'data-slot': 'dialog-description',
  },
})
export class HlmDialogDescriptionDirective {
  constructor() {
    classes(() => 'text-muted-foreground text-sm');
  }
}
