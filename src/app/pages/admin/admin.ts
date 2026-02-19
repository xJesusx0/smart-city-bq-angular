import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButtonDirective } from '../../../lib/components/ui/button';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HlmButtonDirective],
  template: `
    <div class="flex flex-col h-full">
      <nav class="border-b bg-background px-8 py-4 flex gap-4">
        <a hlmBtn variant="ghost" routerLink="users" routerLinkActive="bg-muted" [routerLinkActiveOptions]="{exact: true}">
          Usuarios
        </a>
        <a hlmBtn variant="ghost" routerLink="security" routerLinkActive="bg-muted">
          Seguridad
        </a>
      </nav>
      <div class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent { }
