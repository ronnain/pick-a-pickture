import { Routes } from '@angular/router';
import { EmptyLayoutComponent } from '../../layout/empty-layout.component';

export default <Routes>[
  {
    path: 'admin',
    component: EmptyLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./image-formatter.page'),
      },

    ],
  },
];
