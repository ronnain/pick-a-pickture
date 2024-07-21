import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./features/pick-a-picture/pick-a-picture.routes'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pick-a-picture',
  },
];
