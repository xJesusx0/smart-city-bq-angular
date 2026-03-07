import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SemaphoreStep2Component } from './step-2.component';
import { Intersection } from '../../../../lib/api/semaphores.service';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('SemaphoreStep2Component', () => {
  let component: SemaphoreStep2Component;
  let fixture: ComponentFixture<SemaphoreStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemaphoreStep2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(SemaphoreStep2Component);
    component = fixture.componentInstance;

    // Default Inputs
    fixture.componentRef.setInput('originalLocation', { lat: 10, lng: -74 });
    fixture.componentRef.setInput('intersection', null);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should disable confirm button and show error when distance > 20m', () => {
    fixture.componentRef.setInput('intersection', {
      distance_meters: 25,
      street_a_name: 'Calle 1',
      street_b_name: 'Carrera 2',
    } as any);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const confirmBtn = buttons.find(
      (b) => b.nativeElement.textContent.trim() === 'Confirmar ubicación',
    );
    expect(confirmBtn?.nativeElement.disabled).toBe(true);
    expect(component.isValid()).toBe(false);
  });

  it('should enable confirm button and be valid when distance <= 20m', () => {
    fixture.componentRef.setInput('intersection', {
      distance_meters: 10,
      lat: 10.01,
      lng: -74.01,
      geojson: { coordinates: [-74.01, 10.01] },
    } as any);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const confirmBtn = buttons.find(
      (b) => b.nativeElement.textContent.trim() === 'Confirmar ubicación',
    );
    expect(confirmBtn?.nativeElement.disabled).toBe(false);
    expect(component.isValid()).toBe(true);
    expect(component.snappedLocation()).toEqual({ lat: 10.01, lng: -74.01 });
  });

  it('should emit locationSnapped on submit when valid', () => {
    const spy = vi.spyOn(component.locationSnapped, 'emit');
    fixture.componentRef.setInput('intersection', {
      distance_meters: 15,
      geojson: { coordinates: [-74.01, 10.01] },
    } as any);
    fixture.detectChanges();

    component.confirmSnap();
    expect(spy).toHaveBeenCalledWith({ lat: 10.01, lng: -74.01 });
  });
});
