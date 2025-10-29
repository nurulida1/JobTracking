import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    component: undefined,
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
];
