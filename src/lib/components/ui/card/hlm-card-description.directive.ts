import { Directive } from '@angular/core';
import { classes } from '../../../utils';

@Directive({
    selector: '[hlmCardDescription]',
    host: {
        'data-slot': 'card-description',
    },
})
export class HlmCardDescriptionDirective {
    constructor() {
        classes(() => 'text-muted-foreground text-sm');
    }
}
