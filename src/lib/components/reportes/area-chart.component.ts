import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HlmCardImports } from '../ui/card';
import { HlmSelectImports } from '../ui/select';

@Component({
  selector: 'app-area-chart',
  imports: [NgxChartsModule, ...HlmCardImports, ...HlmSelectImports],
  template: `
    <section hlmCard>
      <div hlmCardHeader class="flex flex-col sm:flex-row items-center gap-2 border-b py-5">
        <div class="grid flex-1 gap-1 text-center sm:text-left">
          <h3 hlmCardTitle>Vehículos - Peatones</h3>
        </div>
        <div class="w-[160px]">
          <!-- Simple select placeholder for now -->
          <select
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            (change)="onRangeChange($event)"
          >
            <option value="90d">Últimos 3 meses</option>
            <option value="30d">Últimos 30 días</option>
            <option value="7d">Últimos 7 días</option>
          </select>
        </div>
      </div>
      <div hlmCardContent class="p-6">
        <div class="h-[300px] w-full">
          <ngx-charts-area-chart
            [results]="chartResults()"
            [view]="[600, 400]"
            [scheme]="colorScheme"
            [legend]="true"
            [showXAxisLabel]="false"
            [showYAxisLabel]="false"
            [xAxis]="true"
            [yAxis]="true"
            [autoScale]="true"
            [curve]="curve"
          >
          </ngx-charts-area-chart>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent {
  timeRange = signal('90d');

  // Dummy data adapted for ngx-charts
  private rawData = [
    { date: '2025-08-01', vehiculos: 185, peatones: 320 },
    { date: '2025-08-05', vehiculos: 220, peatones: 380 },
    { date: '2025-08-10', vehiculos: 188, peatones: 330 },
    { date: '2025-08-15', vehiculos: 190, peatones: 320 },
    { date: '2025-08-20', vehiculos: 192, peatones: 340 },
    { date: '2025-08-25', vehiculos: 170, peatones: 300 },
    { date: '2025-08-31', vehiculos: 195, peatones: 345 },
    { date: '2025-09-05', vehiculos: 190, peatones: 340 },
    { date: '2025-09-10', vehiculos: 195, peatones: 350 },
    { date: '2025-09-15', vehiculos: 188, peatones: 340 },
    { date: '2025-09-20', vehiculos: 205, peatones: 370 },
    { date: '2025-09-25', vehiculos: 182, peatones: 325 },
    { date: '2025-09-30', vehiculos: 180, peatones: 330 },
    { date: '2025-10-05', vehiculos: 210, peatones: 380 },
    { date: '2025-10-10', vehiculos: 165, peatones: 290 },
    { date: '2025-10-15', vehiculos: 215, peatones: 385 },
    { date: '2025-10-20', vehiculos: 180, peatones: 330 },
    { date: '2025-10-25', vehiculos: 210, peatones: 380 },
    { date: '2025-10-31', vehiculos: 190, peatones: 345 },
  ];

  chartResults = computed(() => {
    const range = this.timeRange();
    // Simplified filtering logic
    const data = this.rawData;

    return [
      {
        name: 'Vehículos',
        series: data.map((d) => ({ name: d.date, value: d.vehiculos })),
      },
      {
        name: 'Peatones',
        series: data.map((d) => ({ name: d.date, value: d.peatones })),
      },
    ];
  });

  colorScheme: any = {
    domain: ['#3b82f6', '#10b981'], // Custom colors
  };

  curve: any = 'basis'; // Smooth curve

  onRangeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.timeRange.set(select.value);
  }
}
