import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { UserService } from 'src/app/core/user.service';
import { EmptyLayoutComponent } from 'src/app/layout/empty-layout.component';

export default <Routes>[
  {
    path: '',
    loadComponent: () => import('./home.page'),
  },
  {
    path: 'pick-a-picture',
    component: EmptyLayoutComponent,
    canActivate: [
      () => {
        const userService = inject(UserService);
        const router = inject(Router);
        return userService.getUserName() ? true : router.parseUrl('');
      },
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'round/1',
      },
      {
        path: 'round/:round',
        loadComponent: () => import('./pick-a-picture.page'),
      },
      {
        path: 'round/:round/score/:userScore/scoreTarget/:scoreTarget',
        loadComponent: () => import('./user-round-score.page'),
      },
    ],
  },
];
