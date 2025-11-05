import { Routes } from '@angular/router';
import { canActivateAuth } from './core/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'win',
    loadComponent: () => import('./pages/win/win.page').then(m => m.WinPage)
  },
  {
    path: 'profile',
    canActivate: [canActivateAuth],
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },
  { path: '**', redirectTo: 'home' }
];
