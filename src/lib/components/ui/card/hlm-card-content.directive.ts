import { Directive } from '@angular/core';
import { classes } from '../../../utils';

@Directive({
    selector: '[hlmCardContent]',
    host: {
        'data-slot': 'card-content',
    },
})
export class HlmCardContentDirective {
    constructor() {
        classes(() => 'px-6 group-data-[size=sm]/card:px-4');
    }
}
