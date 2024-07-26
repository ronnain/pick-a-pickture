import { CommonModule } from '@angular/common';
import { Component, inject, NgZone, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UserService } from '../../core/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { gsap } from 'gsap';

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
      id="home-curtain"
      class="fixed top-0 left-0 z-50 w-full h-full bg-yellow grid place-content-center"
    >
      <h1
        class="text-8xl md:text-9xl flex flex-col md:flex-row gap-2 md:gap-10 items-center"
      >
        <span id="the" class="block text-white">The</span>
        <span id="trotro" class="block text-orange font-lora font-bold"
          >Trotro</span
        >
        <span id="game" class="block text-white">game</span>
        <span id="excl" class="block text-white">!</span>
      </h1>
    </div>
    <div
      id="back-app-home"
      class="h-screen w-screen flex flex-col items-center justify-between py-12 pb-[200px]"
    >
      <!-- <div class="w-full bg-yellow p-4 text-center"> -->
      <h1 class="text-2xl md:text-5xl text-orange font-lora font-extrabold">
        Le
        <span class="text-blue text-3xl md:text-6xl font-pacifico">Trotro</span>
        GAME !
      </h1>
      <p class="text-center px-6 text-lg md:text-2xl mt-20">
        Devines la photo préférée de Trotro parmis les 2 propositions.
      </p>
      <!-- </div> -->

      <p-floatLabel class="mt-20">
        <input
          pInputText
          id="username"
          [formControl]="userNameForm"
          placeholder="RoroTheBest"
        />
        <label for="username" class="text-base mb-1">Pseudo (original)</label>
      </p-floatLabel>
      <button
        class="text-2xl px-7 py-2 bg-orange text-white rounded-full mt-4"
        [routerLink]="['/pick-a-picture', 'round', 1]"
        [disabled]="!userNameForm.value"
      >
        Jouer
      </button>

      <div class="absolute bottom-6 left-6 flex items-center">
        <p-button icon="pi pi-crown" severity="help" />
        <img
          src="assets/images/fleche.png"
          alt="fleche"
          class="w-[80px] ml-2 rotate-180 relative bottom-4"
        />
        <span
          class="text-xl font-pacifico font-normal relative -left-2 bottom-2"
        >
          Classement
        </span>
      </div>
    </div>
  `,
})
export default class HomePage implements OnInit {
  private readonly userService = inject(UserService);

  async ngOnInit() {
    const tl = gsap
      .timeline()
      .fromTo(
        '#the',
        { scale: 0, rotate: -360 },
        { rotate: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
      )
      .fromTo(
        '#trotro',
        { scale: 0, y: -300 },
        { scale: 1, y: 0, duration: 1, ease: 'bounce.out' },
        '-=0.1'
      )
      .fromTo(
        '#game',
        { scale: 0, x: 150, skewX: '-45deg' },
        { scale: 1, x: 0, skewX: '0deg', duration: 1.4, ease: 'elastic' },
        '-=0.3'
      )
      .fromTo(
        '#excl',
        { scale: 0, rotateX: 360 },
        { scale: 1, rotateX: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.1'
      )
      .fromTo(
        '#home-curtain',
        { y: 0 },
        { yPercent: -100, duration: 0.7, ease: 'power2.inOut' }
      );
  }

  protected userNameForm = new FormControl(this.userService.getUserName());

  constructor(private ngZone: NgZone) {
    this.userNameForm.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      this.userService.storeUserName(value);
    });
  }
}
