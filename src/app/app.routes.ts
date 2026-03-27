import { Routes } from '@angular/router';
import { LoginComponent } from './features/login-component/login-component';
import { ReclamoComponent } from './features/reclamo-component/reclamo-component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },

  { path: 'reclamos', component: ReclamoComponent },

  { path: '**', redirectTo: 'auth/login' }
];