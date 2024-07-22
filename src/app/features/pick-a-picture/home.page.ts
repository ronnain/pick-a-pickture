import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UserService } from 'src/app/core/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { SupabaseApiService } from 'src/app/core/supabase-api.service';

// todo image formattage
// thumbnail 250 largeur /188 hauteur
// src 800 / 600

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
    InputTextModule,
    MessagesModule,
  ],
  template: `
    <div
      class="h-screen w-screen flex flex-col items-center justify-center  py-2"
    >
      <h1 class="text-2xl">Le Trotro GAME !</h1>

      <div class="flex-1 flex items-center flex-col justify-around gap-4">
        <p-messages
          class="text-justify m-4"
          [value]="[
            {
              severity: 'info',
              detail:
                'Devine la photo préféré de Trotro parmis les 2 propositions.'
            }
          ]"
          [enableService]="false"
          [closable]="false"
        />
        <div class="flex items-center">
          <p-floatLabel>
            <input pInputText id="username" [formControl]="userNameForm" />
            <label for="username">Pseudo</label>
          </p-floatLabel>
          <p-button
            label="Jouer"
            [routerLink]="['/pick-a-picture', 'round', 1]"
            [disabled]="!userNameForm.value"
          ></p-button>
        </div>

        <div class="">
          <p-button
            class="mt-4"
            label="Voir le classement"
            [rounded]="true"
            severity="help"
          ></p-button>
        </div>
      </div>
    </div>
  `,
})
export default class HomePage {
  private readonly userService = inject(UserService);
  private readonly supabaseApiService = inject(SupabaseApiService);

  protected userNameForm = new FormControl(this.userService.getUserName());

  constructor() {
    this.userNameForm.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      this.userService.storeUserName(value);
    });
  }

  async ngOnInit() {
    const result = await this.supabaseApiService.getImageToPicked(1);
    console.log('result', result.data);
  }
}
