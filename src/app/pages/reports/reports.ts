import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-reports',
    imports: [],
    template: `<div class="p-6">
    <h1 class="text-2xl font-bold">Reports</h1>
    <p>Traffic reports and analytics</p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent { }
