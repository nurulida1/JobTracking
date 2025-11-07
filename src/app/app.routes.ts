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
          import('./components/dashboards/dashboard/dashboard').then(
            (m) => m.Dashboard
          ),
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
    path: 'change-password-internal',
    loadComponent: () =>
      import(
        './components/change-password-internal/change-password-internal'
      ).then((m) => m.ChangePasswordInternal),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'confirm-email',
    loadComponent: () =>
      import('./components/confirmEmail/confirmEmail').then(
        (m) => m.ConfirmEmail
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password').then(
        (m) => m.ResetPassword
      ),
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
    path: 'purchase-order',
    loadComponent: () =>
      import('./shared/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './components/purchase-order/purchase-order-rounting.module'
          ).then((m) => m.PurchaseOrderRoutingModule),
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
          import('./components/job/job-rounting.module').then(
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
          import('./components/delivery/delivery-rounting.module').then(
            (m) => m.DeliveryRoutingModule
          ),
      },
    ],
  },
];
