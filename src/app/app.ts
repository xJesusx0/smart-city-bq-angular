import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthQueryService } from '../lib/auth/auth-query.service';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('smart-city-bq-angular');

  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly authQuery = inject(AuthQueryService);
  private readonly destroying$ = new Subject<void>();

  ngOnInit(): void {
    // Handle redirect callback after Azure AD login.
    // When the user returns from Microsoft's login page,
    // this observable fires with the AuthenticationResult.
    this.msalService.handleRedirectObservable().subscribe(async (result) => {
      if (result?.idToken) {
        await this.authQuery.handleMicrosoftRedirectResult(result.idToken);
      }
    });

    // Track interaction status
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
