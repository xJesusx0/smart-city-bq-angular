import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-change-password',
    imports: [],
    template: `<div class="p-6">
    <h1 class="text-2xl font-bold">Change Password</h1>
    <p>Update your password</p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent { }
