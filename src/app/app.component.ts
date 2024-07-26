import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { gsap } from 'gsap';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <div
      id="back-app"
      (click)="onClick($event)"
      class="h-full w-full overflow-hidden relative"
    >
      <router-outlet></router-outlet>
      <div
        id="round-transition"
        class="fixed top-0 left-0 origin-center w-full h-full grid place-content-center z-50 bg-orange  text-center"
      >
        <h1
          class="text-8xl flex flex-col gap-2 md:flex-row origin-center items-center"
          id="round-text"
        >
          <span>Round</span><span id="round-number"></span>
        </h1>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit {
  title = 'choose-a-picture';
  private navigationPending = true;
  private targetUrl = '';

  constructor(private router: Router) {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationStart) {
        if (this.navigationPending) {
          this.navigationPending = false;
          return;
        }
        const path = event.url.split('/');
        if (
          path[path.length - 2] !== 'round' ||
          Number.isNaN(Number(path.at(-1)))
        )
          return;
        const round = path.pop();
        this.navigationPending = true;
        this.targetUrl = event.url;
        this.router.navigateByUrl(this.router.routerState.snapshot.url, {
          skipLocationChange: true,
        });
        const roundNumber = document.getElementById(
          'round-number'
        ) as HTMLSpanElement;
        roundNumber.textContent = round as string;
        gsap
          .timeline()
          .fromTo(
            '#round-transition',
            { scale: 0, xPercent: 0 },
            {
              scale: 1,
              duration: 1.2,
              ease: 'power2.out',
              onComplete: () => {
                this.router.navigateByUrl(this.targetUrl);
              },
            }
          )
          .fromTo(
            '#round-text',
            { rotate: -720 },
            { rotate: 0, duration: 1, ease: 'power2.out' },
            0
          );
      } else if (event instanceof NavigationEnd) {
        if (event.url === this.targetUrl && this.targetUrl !== '') {
          gsap.timeline().to('#round-transition', {
            delay: 0.4,
            xPercent: 100,
            duration: 0.8,
            ease: 'power2.inOut',
          });
        }
      }
    });
  }

  onClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A') {
      return; // Exit the function if the target is a button or a link
    }
    const x = e.clientX;
    const y = e.clientY;

    const backApp = document.getElementById('back-app') as HTMLElement;

    const id = `balloon_${Math.random().toString(36).substring(7)}`;

    const baloonIndex = Math.floor(Math.random() * 7) + 1;

    const img = document.createElement('img');
    img.src = `assets/images/baloon_${baloonIndex}.webp`; // Replace with your image path
    img.style.position = 'absolute';
    img.style.left = `${x - 100}px`;
    img.style.top = `${y - 100}px`;
    img.style.scale = '0';
    img.style.pointerEvents = 'none'; // Set the desired image size

    img.style.width = '200px'; // Set the desired image size
    img.style.height = '200px'; // Set the desired image size
    img.id = id;

    backApp.appendChild(img);

    const rotationValueOrder = Math.random() > 0.5;

    const rotationValue1 =
      (Math.random() * (20 - 5) + 5) * (rotationValueOrder ? 1 : -1);
    const rotationValue2 =
      (Math.random() * (20 - 5) + 5) * (rotationValueOrder ? -1 : 1);

    window.requestAnimationFrame(() => {
      const tl = gsap.timeline({ yoyo: true, repeat: -1 }).fromTo(
        `#${id}`,
        {
          rotate: rotationValue1,
        },
        {
          rotate: rotationValue2,
          duration: 1,
          ease: 'linear',
        }
      );

      gsap
        .timeline()
        .fromTo(
          `#${id}`,
          {
            scale: 0,
          },
          {
            scale: 1,
          }
        )
        .to(`#${id}`, {
          y: -window.innerHeight - 200,
          duration: 10,
          onComplete: () => {
            tl.kill();
            backApp.removeChild(img);
          },
        });
    });
  }

  async ngOnInit() {
    gsap.set('#round-transition', {
      scale: 0,
      rotate: -720,
      pointerEvents: 'none',
    });
  }
}
