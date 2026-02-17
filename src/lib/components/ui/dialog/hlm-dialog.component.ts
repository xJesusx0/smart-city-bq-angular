import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { BrnDialog, provideBrnDialogDefaultOptions } from '@spartan-ng/brain/dialog';
import { HlmDialogOverlayComponent } from './hlm-dialog-overlay.component';

@Component({
    selector: 'hlm-dialog',
    exportAs: 'hlmDialog',
    imports: [HlmDialogOverlayComponent],
    providers: [
        {
            provide: BrnDialog,
            useExisting: forwardRef(() => HlmDialogComponent),
        },
        provideBrnDialogDefaultOptions({
            // add custom options here
        }),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
		<hlm-dialog-overlay />
		<ng-content />
	`,
})
export class HlmDialogComponent extends BrnDialog { }
