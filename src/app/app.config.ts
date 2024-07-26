import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { defaultStoreProvider } from '@state-adapt/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';


export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    defaultStoreProvider,
    provideHttpClient(),
  ],
};
