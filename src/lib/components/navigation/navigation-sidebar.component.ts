import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AuthQueryService } from '../../auth/auth-query.service';
import { getUserInitials } from '../../utils/helpers';
import { getModuleIcon } from '../../utils/icons';
import { HlmButtonDirective } from '../ui/button';
import { HlmSeparatorDirective } from '../ui/separator';
import { LucideAngularModule, Building2, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-navigation-sidebar',
  imports: [
    RouterLink,
    CommonModule,
    RouterLinkActive,
    HlmButtonDirective,
    HlmSeparatorDirective,
    LucideAngularModule,
  ],
  template: `
    <aside class="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div class="p-4 flex items-center gap-2">
        <div
          class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <lucide-icon [name]="Building2Icon" class="size-4"></lucide-icon>
        </div>
        <span class="truncate font-semibold">Smart City</span>
      </div>

      <hlm-separator />

      <nav class="flex-1 overflow-y-auto p-4 space-y-2">
        @for (module of allowedModules(); track module.id) {
          <a
            [routerLink]="'/app' + module.path"
            routerLinkActive="bg-accent text-accent-foreground"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <lucide-icon [name]="getIcon(module.icon)" class="size-4 shrink-0"></lucide-icon>
            <span>{{ module.name }}</span>
          </a>
        }
      </nav>

      <hlm-separator />

      <div class="p-4 space-y-4">
        @if (user(); as u) {
          <div class="flex items-center gap-3">
            <div
              class="size-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium"
            >
              {{ getInitials(u.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate">{{ u.name }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ u.email }}</p>
            </div>
            <button
              hlmBtn
              variant="ghost"
              size="icon"
              class="size-8"
              (click)="onLogout()"
              title="Cerrar sesión"
            >
              <lucide-icon [name]="LogOutIcon" class="size-4"></lucide-icon>
            </button>
          </div>
        }
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSidebarComponent {
  private authService = inject(AuthService);
  private authQuery = inject(AuthQueryService);

  readonly user = this.authService.user;
  readonly allowedModules = computed(() => this.user()?.modules || []);

  readonly Building2Icon = Building2;
  readonly LogOutIcon = LogOut;

  getInitials(name: string) {
    return getUserInitials(name);
  }

  getIcon(iconName: string) {
    return getModuleIcon(iconName);
  }

  onLogout() {
    this.authQuery.logout();
  }
}
