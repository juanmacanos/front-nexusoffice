import { Routes } from '@angular/router';
import { UserPanelComponent } from './pages/user-panel/user-panel.component';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CalendarViewGlobalComponent } from './pages/heatmap/heatmap.component';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'user-panel', component: UserPanelComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'global', component: CalendarViewGlobalComponent},
      { path: '', redirectTo: 'user-panel', pathMatch: 'full' },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
