import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GeoService } from '../../../lib/api/geo.service';
import { TrafficLightsStatsComponent } from '../../../lib/components/cameras/traffic-lights-stats.component';
import { TrafficLightsListComponent } from '../../../lib/components/cameras/traffic-lights-list.component';
import { TrafficLightsMapComponent } from '../../../lib/components/cameras/traffic-lights-map.component';
import { TrafficLightDetailsDialogComponent } from '../../../lib/components/cameras/traffic-light-details-dialog.component';
import { HlmButtonDirective } from '../../../lib/components/ui/button';
import { HlmTabsImports } from '../../../lib/components/ui/tabs';
import { HlmIconDirective } from '../../../lib/components/ui/icon';
import { LucideAngularModule, MapPin, PlusCircle, AlertTriangle, Loader, Map as MapIcon, List as ListIcon } from 'lucide-angular';
import type { components } from '../../../lib/__gen__/api_v1';

type TrafficLight = components['schemas']['TrafficLight'];

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [
    CommonModule,
    TrafficLightsStatsComponent,
    TrafficLightsListComponent,
    TrafficLightsMapComponent,
    TrafficLightDetailsDialogComponent,
    HlmButtonDirective,
    ...HlmTabsImports,
    LucideAngularModule,
  ],
  templateUrl: './cameras.html',
  styleUrl: './cameras.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamerasComponent implements OnInit {
  private geoService = inject(GeoService);
  private router = inject(Router);

  readonly MapPinIcon = MapPin;
  readonly PlusCircleIcon = PlusCircle;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly LoaderIcon = Loader;
  readonly MapIcon = MapIcon;
  readonly ListIcon = ListIcon;

  trafficLights = signal<TrafficLight[]>([]);
  isLoading = signal(false);
  isError = signal(false);

  viewMode = signal<'map' | 'list'>('map');
  searchQuery = signal('');
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');

  selectedTrafficLight = signal<TrafficLight | null>(null);
  detailsDialogOpen = signal(false);

  filteredTrafficLights = computed(() => {
    let filtered = this.trafficLights();
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      filtered = filtered.filter(tl =>
        tl.name?.toLowerCase().includes(query) ||
        tl.id?.toString().includes(query)
      );
    }

    if (this.statusFilter() === 'active') {
      filtered = filtered.filter(tl => tl.active);
    } else if (this.statusFilter() === 'inactive') {
      filtered = filtered.filter(tl => !tl.active);
    }

    return filtered;
  });

  ngOnInit() {
    this.loadData();
    const savedView = localStorage.getItem('cameras-view-mode');
    if (savedView === 'map' || savedView === 'list') {
      this.viewMode.set(savedView);
    }
  }

  async loadData() {
    this.isLoading.set(true);
    this.isError.set(false);
    try {
      const data = await this.geoService.getTrafficLights();
      this.trafficLights.set(data);
    } catch (e) {
      this.isError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  handleCreateTrafficLight() {
    this.router.navigate(['/cameras/create']);
  }

  handleViewDetails(light: TrafficLight) {
    this.selectedTrafficLight.set(light);
    this.detailsDialogOpen.set(true);
  }

  setViewMode(mode: 'map' | 'list') {
    this.viewMode.set(mode);
    localStorage.setItem('cameras-view-mode', mode);
  }

  closeDetails() {
    this.detailsDialogOpen.set(false);
  }
}
