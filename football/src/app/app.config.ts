import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, RouterModule, RouterOutlet} from '@angular/router';

import { routes } from './app.routes';
import {CommonModule} from '@angular/common';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {PlayerService} from './services/player.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';




export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),  provideRouter(routes), RouterModule, FormsModule, ReactiveFormsModule,  CommonModule, provideHttpClient(),   RouterOutlet, PlayerService],

};
