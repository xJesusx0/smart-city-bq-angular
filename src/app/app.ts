import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('smart-city-bq-angular');

  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly destroying$ = new Subject<void>();

  ngOnInit(): void {
    // Handle redirect callback after Azure AD login
    this.msalService.handleRedirectObservable().subscribe();

    // Track interaction status (useful for showing loading states)
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status) => status === InteractionStatus.None),
        takeUntil(this.destroying$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}
