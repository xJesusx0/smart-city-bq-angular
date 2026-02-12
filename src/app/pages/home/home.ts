import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-home',
    imports: [],
    template: `<div class="p-6">
    <h1 class="text-2xl font-bold">Home</h1>
    <p>Welcome to the Smart City Dashboard</p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent { }
