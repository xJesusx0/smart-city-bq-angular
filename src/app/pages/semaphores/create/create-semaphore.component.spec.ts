import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSemaphoreComponent } from './create-semaphore.component';
import { QueryClient, provideAngularQuery } from '@tanstack/angular-query-experimental';
import { SemaphoresService } from '../../../../lib/api/semaphores.service';
import { vi } from 'vitest';

describe('CreateSemaphoreComponent', () => {
  let component: CreateSemaphoreComponent;
  let fixture: ComponentFixture<CreateSemaphoreComponent>;

  beforeEach(async () => {
    const mockSemaphoresService = {
      getNearbyIntersections: vi.fn().mockResolvedValue([]),
    };

    const queryClient = new QueryClient();

    await TestBed.configureTestingModule({
      imports: [CreateSemaphoreComponent],
      providers: [
        { provide: SemaphoresService, useValue: mockSemaphoresService },
        provideAngularQuery(queryClient),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSemaphoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start at step 1', () => {
    expect(component.state().currentStep).toBe(1);
  });

  it('should update location specifically', () => {
    component.onLocationSelected({ lat: 10, lng: -74 });
    expect(component.state().location?.lat).toBe(10);
  });
});
