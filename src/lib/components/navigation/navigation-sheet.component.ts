import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { getUserInitials } from '../../utils/helpers';
import { getModuleIcon } from '../../utils/icons';
import { HlmButtonDirective } from '../ui/button';
import { HlmSeparatorDirective } from '../ui/separator';
import { LucideAngularModule, Building2, LogOut, Menu, X } from 'lucide-angular';

@Component({
    selector: 'app-navigation-sheet',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        HlmButtonDirective,
        HlmSeparatorDirective,
        LucideAngularModule,
    ],
    template: `
    <div class="flex items-center justify-between border-b p-4 md:hidden bg-card">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <lucide-icon [name]="Building2Icon" class="h-4 w-4"></lucide-icon>
        </div>
        <h1 class="text-lg font-semibold">Smart City</h1>
      </div>

      <button hlmBtn variant="ghost" size="icon" (click)="toggleMenu()">
        <lucide-icon [name]="MenuIcon" class="h-5 w-5"></lucide-icon>
        <span class="sr-only">Abrir menú</span>
      </button>

      <!-- Mobile Menu Overlay -->
      @if (isOpen()) {
        <div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden" (click)="closeMenu()"></div>
        <div class="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-card p-0 shadow-lg md:hidden animate-in slide-in-from-left duration-300">
          <div class="flex h-full flex-col">
            <div class="flex items-center justify-between p-6">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <lucide-icon [name]="Building2Icon" class="h-4 w-4"></lucide-icon>
                </div>
                <span class="font-semibold">Smart City</span>
              </div>
              <button hlmBtn variant="ghost" size="icon" (click)="closeMenu()">
                <lucide-icon [name]="XIcon" class="h-5 w-5"></lucide-icon>
              </button>
            </div>

            <nav class="flex-1 overflow-y-auto p-6 space-y-2">
              @for (module of allowedModules(); track module.id) {
                <a
                  [routerLink]="module.path"
                  routerLinkActive="bg-accent text-accent-foreground"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  (click)="closeMenu()"
                >
                  <lucide-icon [name]="getIcon(module.icon)" class="h-4 w-4"></lucide-icon>
                  {{ module.name }}
                </a>
              }
            </nav>

            <hlm-separator />

            @if (user(); as u) {
              <div class="p-6">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                    {{ getInitials(u.name) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium">{{ u.name }}</p>
                    <p class="truncate text-xs text-muted-foreground">{{ u.email }}</p>
                  </div>
                  <button hlmBtn variant="ghost" size="icon" class="h-8 w-8" (click)="onLogout()" title="Cerrar sesión">
                    <lucide-icon [name]="LogOutIcon" class="h-4 w-4"></lucide-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationSheetComponent {
    private authService = inject(AuthService);

    readonly user = this.authService.user;
    readonly allowedModules = computed(() => this.user()?.modules || []);

    readonly Building2Icon = Building2;
    readonly LogOutIcon = LogOut;
    readonly MenuIcon = Menu;
    readonly XIcon = X;

    isOpen = signal(false);

    toggleMenu() {
        this.isOpen.update(v => !v);
    }

    closeMenu() {
        this.isOpen.set(false);
    }

    getInitials(name: string) {
        return getUserInitials(name);
    }

    getIcon(iconName: string) {
        return getModuleIcon(iconName);
    }

    onLogout() {
        this.authService.clearUser();
    }
}
