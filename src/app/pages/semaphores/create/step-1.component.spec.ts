import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SemaphoreStep1Component } from './step-1.component';
import { SemaphoresService } from '../../../../lib/api/semaphores.service';
import { QueryClient, provideAngularQuery } from '@tanstack/angular-query-experimental';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('SemaphoreStep1Component', () => {
  let component: SemaphoreStep1Component;
  let fixture: ComponentFixture<SemaphoreStep1Component>;
  let mockSemaphoresService: any;

  beforeEach(async () => {
    mockSemaphoresService = {
      getNearbyIntersections: vi.fn().mockResolvedValue([
        {
          neighborhood: 'El Prado',
          city: 'Barranquilla',
          distance_meters: 10,
          intersection_id: 1,
          lat: 10.99,
          lng: -74.79,
        },
      ]),
    };

    const queryClient = new QueryClient();

    await TestBed.configureTestingModule({
      imports: [SemaphoreStep1Component],
      providers: [
        { provide: SemaphoresService, useValue: mockSemaphoresService },
        provideAngularQuery(queryClient),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SemaphoreStep1Component);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch intersections when location is provided', async () => {
    fixture.componentRef.setInput('location', { lat: 10.99, lng: -74.79 });
    fixture.detectChanges();

    // The query should be enabled and fetch data
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockSemaphoresService.getNearbyIntersections).toHaveBeenCalledWith(10.99, -74.79);
  });
});
