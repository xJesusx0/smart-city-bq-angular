import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-unauthorized',
    imports: [],
    template: `<div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-red-600">Unauthorized</h1>
    <p>You don't have permission to access this page</p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent { }
