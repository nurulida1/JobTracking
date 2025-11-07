import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import MyPreset from '../themes/mypreset';
import { AuthInterceptorFn } from './common/interceptor/auth.interceptor';
import { CsrfInterceptorFn } from './common/interceptor/csrf.interceptor';
import { ErrorInterceptorFn } from './common/interceptor/error.interceptor';
import { environment } from '../environments/environment';
import { provideAuth, LogLevel } from 'angular-auth-oidc-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAuth({
      config: {
        authority: environment.AuthServerUrl,
        redirectUrl: environment.RedirectUrl,
        postLogoutRedirectUri: environment.RedirectUrl,
        clientId: 'JWehinIIC2ZltUZgkQPF1CWIg30Q7UhU',
        scope: 'openid profile email offline_access roles api_scope',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        ignoreNonceAfterRefresh: true, // this is required if the id_token is not returned
        triggerRefreshWhenIdTokenExpired: false, // required when refreshing the browser if id_token is not updated after the first authentication
        // allowUnsafeReuseRefreshToken: true, // this is required if the refresh token is not rotated
        autoUserInfo: true, // if the user endpoint is not supported.
        logLevel: LogLevel.Error,
        historyCleanupOff: false,
        triggerAuthorizationResultEvent: true,
      },
    }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        CsrfInterceptorFn,
        AuthInterceptorFn,
        ErrorInterceptorFn,
      ])
    ),
    ConfirmationService,
    MessageService,
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          prefix: 'p',
          darkModeSelector: 'darkMode',
        },
      },
    }),
  ],
};
