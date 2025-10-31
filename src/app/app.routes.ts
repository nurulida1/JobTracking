import { Routes } from '@angular/router';
import { SplashScreen } from './components/splashScreen/splashScreen';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '', component: SplashScreen },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./shared/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./components/notifications/notifications').then(
        (m) => m.Notifications
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then((m) => m.Register),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings').then((m) => m.Settings),
  },
  {
    path: 'quotation',
    loadComponent: () =>
      import('./shared/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/quotation/quotation-rounting.module').then(
            (m) => m.QuotationRoutingModule
          ),
      },
    ],
  },
  {
    path: 'job',
    loadComponent: () =>
      import('./shared/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/job/quotation-rounting.module').then(
            (m) => m.JobRoutingModule
          ),
      },
    ],
  },
  {
    path: 'delivery',
    loadComponent: () =>
      import('./shared/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/delivery/quotation-rounting.module').then(
            (m) => m.DeliveryRoutingModule
          ),
      },
    ],
  },
];
