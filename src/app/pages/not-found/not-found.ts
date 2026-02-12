import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-not-found',
    imports: [],
    template: `<div class="p-6 text-center">
    <h1 class="text-4xl font-bold">404</h1>
    <p>Page not found</p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent { }
