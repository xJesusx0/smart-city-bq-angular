import { Directive } from '@angular/core';
import { classes } from '../../../utils';

@Directive({
    selector: 'hlm-select-value,[hlmSelectValue], brn-select-value[hlm]',
})
export class HlmSelectValueDirective {
    constructor() {
        classes(() => 'data-[placeholder]:text-muted-foreground line-clamp-1 flex items-center gap-2 truncate');
    }
}
