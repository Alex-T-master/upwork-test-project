import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./components/home/home.routes').then(m => m.HOME_ROUTES) },
  { path: 'messages', loadChildren: () => import('./components/messages/messages.routes').then(m => m.MESSAGES_ROUTES) },
  { path: '**', redirectTo: '' }
];