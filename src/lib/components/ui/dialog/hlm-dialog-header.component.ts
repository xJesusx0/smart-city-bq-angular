import { Directive } from '@angular/core';
import { classes } from '../../../utils';

@Directive({
    selector: '[hlmDialogHeader],hlm-dialog-header',
    host: {
        'data-slot': 'dialog-header',
    },
})
export class HlmDialogHeaderComponent {
    constructor() {
        classes(() => 'flex flex-col gap-2 text-center sm:text-start');
    }
}
