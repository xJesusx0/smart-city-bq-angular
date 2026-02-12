import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-admin',
    imports: [],
    template: `<div class="p-6">
    <h1 class="text-2xl font-bold">Admin</h1>
    <p>Admin panel</p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent { }
