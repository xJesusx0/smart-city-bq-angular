import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HlmCardImports } from '../ui/card';

@Component({
    selector: 'app-bar-chart',
    standalone: true,
    imports: [
        CommonModule,
        NgxChartsModule,
        ...HlmCardImports,
    ],
    template: `
    <section hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Vehículos vs Peatones</h3>
      </div>
      <div hlmCardContent class="p-6">
        <div class="h-[300px] w-full">
          <ngx-charts-bar-vertical-2d
            [results]="chartData"
            [scheme]="colorScheme"
            [xAxis]="true"
            [yAxis]="true"
            [legend]="true"
            [showXAxisLabel]="false"
            [showYAxisLabel]="false"
            [groupPadding]="16"
          >
          </ngx-charts-bar-vertical-2d>
        </div>
      </div>
    </section>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
    chartData = [
        {
            name: 'Agosto',
            series: [
                { name: 'Vehículos', value: 300 },
                { name: 'Peatones', value: 250 }
            ]
        },
        {
            name: 'Septiembre',
            series: [
                { name: 'Vehículos', value: 300 },
                { name: 'Peatones', value: 100 }
            ]
        },
        {
            name: 'Octubre',
            series: [
                { name: 'Vehículos', value: 320 },
                { name: 'Peatones', value: 280 }
            ]
        },
        {
            name: 'Noviembre',
            series: [
                { name: 'Vehículos', value: 100 },
                { name: 'Peatones', value: 120 }
            ]
        },
        {
            name: 'Diciembre',
            series: [
                { name: 'Vehículos', value: 250 },
                { name: 'Peatones', value: 200 }
            ]
        },
        {
            name: 'Enero',
            series: [
                { name: 'Vehículos', value: 220 },
                { name: 'Peatones', value: 180 }
            ]
        }
    ];

    colorScheme: any = {
        domain: ['#3b82f6', '#10b981']
    };
}
