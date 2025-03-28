import { Routes } from '@angular/router';
import {PlayerListComponent} from './components/player-list/player-list.component';
import {PlayerFormComponent} from './components/player-form/player-form.component';
import {PlayerDetailComponent} from './components/player-detail/player-detail.component';
import {PlayerEditComponent} from './components/player-edit/player-edit.component';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {authGuard} from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/players', pathMatch: 'full' },
  { path: 'players', component: PlayerListComponent, canActivate: [authGuard] },
  { path: 'player/add', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: 'player/detail/:id', component: PlayerDetailComponent, canActivate: [authGuard] },
  { path: 'player/edit/:id', component: PlayerEditComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/players' }
];
