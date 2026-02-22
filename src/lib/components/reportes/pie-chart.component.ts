import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HlmCardImports } from '../ui/card';
import { HlmSelectImports } from '../ui/select';
import { LucideAngularModule, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-pie-chart',
  imports: [
    NgxChartsModule,
    TitleCasePipe,
    ...HlmCardImports,
    ...HlmSelectImports,
    LucideAngularModule,
  ],
  template: `
    <section hlmCard class="flex flex-col h-full">
      <div hlmCardHeader class="flex flex-row items-start space-y-0 pb-0">
        <div class="grid gap-1">
          <h3 hlmCardTitle>Distribución Vehículos vs Peatones</h3>
          <p hlmCardDescription>Proporción por mes</p>
        </div>
        <div class="ml-auto w-[130px]">
          <select
            class="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            (change)="onMonthChange($event)"
          >
            @for (m of months; track m) {
              <option [value]="m">{{ m | titlecase }}</option>
            }
          </select>
        </div>
      </div>
      <div hlmCardContent class="flex-1 p-6">
        <div class="h-[250px] w-full">
          <ngx-charts-pie-chart
            [results]="activeMonthResults()"
            [scheme]="colorScheme"
            [labels]="true"
            [doughnut]="true"
            [arcWidth]="0.25"
          >
          </ngx-charts-pie-chart>
        </div>
      </div>
      <div hlmCardFooter class="flex-col gap-2 text-sm border-t p-6">
        <div class="flex items-center gap-2 leading-none font-medium">
          {{ trendMessage() }}
          <lucide-icon [name]="TrendingUpIcon" class="size-4"></lucide-icon>
        </div>
        <div class="leading-none text-muted-foreground">
          Vehículos: {{ activeData()?.vehiculos }}, Peatones: {{ activeData()?.peatones }}
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent {
  readonly TrendingUpIcon = TrendingUp;

  activeMonth = signal('agosto');

  months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
  ];

  private chartData = [
    { month: 'enero', vehiculos: 280, peatones: 200 },
    { month: 'febrero', vehiculos: 320, peatones: 180 },
    { month: 'marzo', vehiculos: 290, peatones: 220 },
    { month: 'abril', vehiculos: 310, peatones: 190 },
    { month: 'mayo', vehiculos: 250, peatones: 260 },
    { month: 'junio', vehiculos: 330, peatones: 170 },
    { month: 'julio', vehiculos: 350, peatones: 150 },
    { month: 'agosto', vehiculos: 300, peatones: 250 },
    { month: 'septiembre', vehiculos: 300, peatones: 100 },
    { month: 'octubre', vehiculos: 320, peatones: 340 },
  ];

  activeData = computed(() => this.chartData.find((d) => d.month === this.activeMonth()));

  activeMonthResults = computed(() => {
    const data = this.activeData();
    if (!data) return [];
    return [
      { name: 'Vehículos', value: data.vehiculos },
      { name: 'Peatones', value: data.peatones },
    ];
  });

  trendMessage = computed(() => {
    const data = this.activeData();
    if (!data) return '';
    return data.vehiculos > data.peatones
      ? 'Más vehículos que peatones'
      : 'Más peatones que vehículos';
  });

  colorScheme: any = {
    domain: ['#3b82f6', '#10b981'],
  };

  onMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.activeMonth.set(select.value);
  }
}
