import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-round-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      id="star"
      class="absolute right-6 top-6 text-2xl size-[52px] text-white bg-orange rounded-full grid place-content-center"
      [ngStyle]="{
        clipPath:
          'polygon(39.04% 29.48%, 9.91% 19.91%, 25.08% 47.22%, 0.60% 64.51%, 29.73% 69.44%, 27.93% 99.54%, 49.85% 79.17%, 72.07% 99.54%, 70.15% 69.44%, 99.40% 64.51%, 74.90% 47.22%, 89.93% 19.91%, 60.96% 29.48%, 49.85% 0.62%, 39.04% 29.48%)'
      }"
    >
      <h1 class="relative bottom-0.5">{{ round }}</h1>
    </div>
  `,
})
export class RoundIndicatorComponent implements OnInit {
  @Input() round!: number | string;

  ngOnInit(): void {
    gsap
      .timeline({
        delay: 3,
        repeatDelay: 6,
        repeat: -1,
      })
      .to('#star', {
        rotate: 70,
        duration: 1,
        ease: 'power1.in',
      })
      .to('#star', {
        rotate: -90,
        duration: 1,
        ease: 'power1.in',
      })
      .to('#star', {
        rotate: 70,
        x: 100,
        duration: 1,
        ease: 'power2.in',
      })
      .to(
        '#star',
        {
          rotate: 0,
          x: 0,
          duration: 1,
          ease: 'power2.out',
        },
        '+=1'
      );
  }
}
