import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UserService } from 'src/app/core/user.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    RouterModule,
    FloatLabelModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <div
      class="h-screen w-screen flex flex-col items-center justify-center  py-2"
    >
      <h1 class="text-2xl">Le Trotro GAME !</h1>

      <div class="">
        <div class="card flex justify-content-center">
          <p-floatLabel>
            <input pInputText id="username" [formControl]="userNameForm" />
            <label for="username">Username</label>
          </p-floatLabel>
        </div>
        <p-button
          class="mt-4"
          label="Start Game"
          [routerLink]="['/pick-a-picture', 'round', 1]"
        ></p-button>
      </div>

      <p-button class="mt-4" label="Classement"></p-button>
    </div>
  `,
})
export default class HomePage {
  private readonly userService = inject(UserService);

  protected userNameForm = new FormControl('');

  constructor() {
    this.userNameForm.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      this.userService.storeUserName(value);
    });
  }
}
