import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-round-score-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  template: ` <div
    class="h-screen w-screen flex flex-col items-center justify-center  py-2"
  >
    <h1 class="text-4xl">Round {{ round() }}</h1>
    <h2 class="text-2xl">Score: {{ userScore() }} / {{ scoreTarget() }}</h2>
    <p-button
      class="mt-4"
      label="Next Round"
      [routerLink]="['/pick-a-picture', 'round', parseInt(round(), 10) + 1]"
    ></p-button>
  </div>`,
})
export default class UserRoundScorePage {
  round = input<string>('1');
  userScore = input<number>();
  scoreTarget = input<number>();

  parseInt = parseInt;
}
