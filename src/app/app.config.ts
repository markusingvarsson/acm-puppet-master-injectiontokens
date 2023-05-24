import {
  ApplicationConfig,
  InjectionToken,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { MockAuthService } from './mock-auth.service';
import { Observable, of, tap } from 'rxjs';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

export interface AppConfig {
  baseUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export class TokenInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = 'puppet-master-token';
    const authReq = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
    return next.handle(authReq);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    { provide: AuthService, useClass: AuthService },
    {
      provide: APP_CONFIG,
      useValue: { baseUrl: '/assets' },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useValue: {
        intercept: (request: HttpRequest<any>, next: HttpHandler) => {
          const token = 'puppet-master-token2';
          const authReq = request.clone({
            headers: request.headers.set('Authorization2', 'Bearer ' + token),
          });
          return next.handle(authReq);
        },
      },
      multi: true,
    },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: 'short' },
    },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: false } },
  ],
};
