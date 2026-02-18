import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmButtonDirective } from '../../../lib/components/ui/button';

@Component({
  selector: 'app-not-found',
  imports: [
    CommonModule,
    RouterLink,
    ...HlmCardImports,
    HlmButtonDirective,
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent { }

