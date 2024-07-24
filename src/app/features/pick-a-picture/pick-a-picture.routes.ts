import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { EmptyLayoutComponent } from '../../layout/empty-layout.component';
import { UserService } from '../../core/user.service';

export default <Routes>[
  {
    path: '',
    loadComponent: () => import('./home.page'),
  },
  {
    path: 'leader-board',
    loadComponent: () => import('./leader-board.page'),
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
