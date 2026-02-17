import { Directive } from '@angular/core';
import { classes } from '../../../utils';

@Directive({
    selector: 'hlm-select, brn-select [hlm]',
})
export class HlmSelectDirective {
    constructor() {
        classes(() => 'space-y-2');
    }
}
