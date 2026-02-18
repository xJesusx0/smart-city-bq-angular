import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationSidebarComponent } from '../../../lib/components/navigation/navigation-sidebar.component';
import { NavigationSheetComponent } from '../../../lib/components/navigation/navigation-sheet.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationSidebarComponent, NavigationSheetComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent { }
