import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-cameras',
    imports: [],
    template: `<div class="p-6">
    <h1 class="text-2xl font-bold">Cameras</h1>
    <p>Camera monitoring</p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamerasComponent { }
