import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-round-score-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonModule, RouterModule, LottieComponent],
  template: ` <div
    class="h-page min-h-page w-screen flex flex-col items-center justify-center  py-2"
  >
    @if(!animationComplete()) {
    <div class="fixed top-0 left-0 w-full h-full z-50 pointer-events-none">
      <ng-lottie
        width="100%"
        height="100%"
        [options]="options"
        class="w-full h-full object-cover"
        (animationCreated)="animationCreated($event)"
        (complete)="animationComplete.set(true)"
      />
    </div>

    }

    <h1 class="text-4xl">Round {{ round() }}</h1>
    <h2 class="text-2xl mt-2">
      Score: {{ userScore() }} / {{ scoreTarget() }}
    </h2>
    <a
      *ngIf="hasANextRound()"
      class="mt-4 z-10 bg-orange text-white px-6 py-4 text-2xl rounded-full"
      [routerLink]="['/pick-a-picture', 'round', parseInt(round(), 10) + 1]"
    >
      Niveau suivant
    </a>
    <a
      *ngIf="!hasANextRound()"
      class="mt-4 z-10 bg-violet-600 text-white px-6 py-4 text-2xl rounded-full"
      [routerLink]="['']"
      >Accueil</a
    >
  </div>`,
})
export default class UserRoundScorePage {
  round = input<string>('1');
  userScore = input<number>();
  scoreTarget = input<number>();
  hasANextRound = computed(() => parseInt(this.round(), 10) < 5);
  private animationItem: AnimationItem | undefined;
  animationComplete = signal(false);

  options: AnimationOptions = {
    path: '/assets/confetis.json',
    loop: false,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  parseInt = parseInt;
}
