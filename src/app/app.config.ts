import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { DateAdapter } from '@angular/material/core';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule } from 'angular-calendar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LOCALE_ID, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    environment.production ? provideServiceWorker('ngsw-worker.js') : [],
    { provide: LOCALE_ID, useValue: 'es' },
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })]
};
