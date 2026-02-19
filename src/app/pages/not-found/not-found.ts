import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { LucideAngularModule, House, ArrowLeft, FileX } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    ...HlmCardImports,
    HlmButtonDirective,
    LucideAngularModule,
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  private router = inject(Router);
  private location = inject(Location);

  readonly HouseIcon = House;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly FileXIcon = FileX;

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.location.back();
  }
}

