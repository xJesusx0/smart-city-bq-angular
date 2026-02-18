import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { AuthService } from '../../../lib/auth/auth.service';
import { LucideAngularModule, ShieldX, ArrowRight, Clock } from 'lucide-angular';

@Component({
  selector: 'app-unauthorized',
  imports: [
    CommonModule,
    RouterLink,
    ...HlmCardImports,
    LucideAngularModule,
  ],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly ShieldXIcon = ShieldX;
  readonly ArrowRightIcon = ArrowRight;
  readonly ClockIcon = Clock;

  readonly user = this.authService.user;
  readonly allowedRoutes = computed(() => {
    // We assume the user has modules with name and path
    // In our AuthService, allowedRoutes currently is just string[].
    // Let's adapt it to what the template expects or keep it simple.
    const currentUser = this.user();
    return currentUser?.modules.map(m => ({ name: m.name, path: m.path })) || [];
  });

  countdown = signal(10);
  private intervalId?: any;

  ngOnInit(): void {
    const routes = this.allowedRoutes();
    if (routes.length > 0) {
      this.intervalId = setInterval(() => {
        this.countdown.update(c => c - 1);
        if (this.countdown() === 0) {
          this.clearInterval();
          this.router.navigate([routes[0].path]);
        }
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

