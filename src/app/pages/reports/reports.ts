import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaChartComponent } from '../../../lib/components/reportes/area-chart.component';
import { BarChartComponent } from '../../../lib/components/reportes/bar-chart.component';
import { PieChartComponent } from '../../../lib/components/reportes/pie-chart.component';
import { HlmCardImports } from '../../../lib/components/ui/card';
import { HlmSelectImports } from '../../../lib/components/ui/select';
import { LucideAngularModule, Calendar, Car, Users, TrendingUp, Activity } from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    AreaChartComponent,
    BarChartComponent,
    PieChartComponent,
    ...HlmCardImports,
    ...HlmSelectImports,
    LucideAngularModule,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {
  readonly CalendarIcon = Calendar;
  readonly CarIcon = Car;
  readonly UsersIcon = Users;
  readonly TrendingUpIcon = TrendingUp;
  readonly ActivityIcon = Activity;

  selectedPeriod = signal('90d');
  selectedLocation = signal('all');

  summaryStats = [
    {
      title: 'Total Vehículos',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Car,
      color: 'text-blue-600'
    },
    {
      title: 'Total Peatones',
      value: '3,120',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Pico de Tráfico',
      value: '420',
      change: '4 Sep 2025',
      trend: 'neutral',
      icon: Activity,
      color: 'text-orange-600'
    },
    {
      title: 'Tendencia',
      value: 'Creciente',
      change: '+5.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  lastUpdate = new Date();

  onPeriodChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriod.set(select.value);
  }

  onLocationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLocation.set(select.value);
  }
}
