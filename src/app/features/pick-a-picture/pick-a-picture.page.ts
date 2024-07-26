import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ImageModule } from 'primeng/image';
import {
  MainUserPhotoService,
  PhotoService,
  UserPhotoService,
} from './photo.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  shareReplay,
  skip,
  switchMap,
  take,
} from 'rxjs';
import { adapt } from '@state-adapt/angular';
import { toSource } from '@state-adapt/rxjs';
import { statedStream } from '../../util/rxjs-stated-stream';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router, RouterModule } from '@angular/router';
import { PickPicture } from '../../core/supabase-api.service';
import { UserService } from '../../core/user.service';
import { RoundIndicatorComponent } from './round-indicator.component'; // Import the new component

export type PickPictureState = {
  isLoading: boolean;
  images: ReadonlyArray<PickPicture>;
  round: 1 | 2 | 3 | 4 | 5;
  step: number;
  imagesToChoose: ReadonlyArray<PickPicture>;
};

@Component({
  selector: 'app-pick-a-picture-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ImageModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    RouterModule,
    RoundIndicatorComponent,
  ],
  providers: [
    {
      provide: PhotoService,
      useFactory: () => {
        const userService = inject(UserService);
        return userService.isMainUser()
          ? new MainUserPhotoService()
          : new UserPhotoService();
      },
    },
  ],
  template: `
    <div class="">
      <div
        class="h-screen w-screen flex flex-col items-center justify-center py-6"
        id="back-app-picture"
      >
        @if (isLoading$ | async) {
        <div class="h-screen w-screen flex items-center justify-center">
          <p-progressSpinner></p-progressSpinner>
        </div>
        } @if (isLoaded$ | async) {
        <div class="mt-14" *ngIf="((imagesToChoose$ | async)?.length ?? 0) > 0">
          <span> Clique sur l'image pour l'agrandir</span>
        </div>
        <div
          class="flex flex-col items-center justify-center grow gap-2 pb-10"
          *ngIf="imagesToChoose$ | async as imagesToChoose"
        >
          @for (image of imagesToChoose; track image.id; let index = $index) {
          <div class="rounded">
            <div
              class="flex flex-col justify-center items-center gap-2 border-[10px] border-2 p-component"
              [ngClass]="{
                'border-blue': index === 0,
                'border-orange': index !== 0
              }"
            >
              <p-image
                class="flex-1 max-h-[187px] overflow-hidden"
                [src]="image.thumbnailImageSrc"
                [previewImageSrc]="image.imageSrc"
                width="250"
                [preview]="true"
              />
            </div>
          </div>
          } @empty {
          <h1 class="text-4xl mb-4">T'es sûr de toi ?</h1>
          <button
            (click)="submit()"
            class="bg-pink rounded-full text-white py-4 px-6 text-xl w-[150px]"
          >
            Yes !
          </button>
          }

          <div *ngIf="imagesToChoose.length > 0" class="flex gap-4 w-full mt-3">
            <button
              class="grow w-full font-pacifico bg-blue rounded-full py-3"
              (click)="
                setImageSelected({ indexImageSelected: 0, imagesToChoose });
                nextStep()
              "
            >
              <ng-container
                *ngIf="
                  imagesToChoose[0] && imagesToChoose[0].isSelectedByTheUser;
                  else notSelected0
                "
              >
                <i class="pi pi-check" style="font-size: 1rem"></i>
              </ng-container>
              <ng-template #notSelected0>Haut</ng-template>
            </button>
            <button
              id="1"
              class="grow w-full font-pacifico bg-orange rounded-full py-3"
              (click)="
                setImageSelected({ indexImageSelected: 1, imagesToChoose });
                nextStep()
              "
            >
              <ng-container
                *ngIf="
                  imagesToChoose[1] && imagesToChoose[1].isSelectedByTheUser;
                  else notSelected1
                "
              >
                <i class="pi pi-check" style="font-size: 1rem"></i> Bas
              </ng-container>
              <ng-template #notSelected1>Bas</ng-template>
            </button>
          </div>
        </div>

        <p-button
          [routerLink]="['']"
          icon="pi pi-home"
          severity="help"
          class="absolute left-6 top-6"
          [rounded]="true"
        />
        <div class="absolute bottom-6 left-6 flex items-center">
          <p-button
            icon="pi pi-angle-left"
            [rounded]="true"
            (onClick)="previousStep()"
            [disabled]="(hasAPreviousStep$ | async) === false"
          />
          <ng-container *ngIf="(imagesToChoose$ | async)?.length === 0">
            <img
              src="assets/images/fleche.png"
              alt="fleche"
              class="w-[80px] ml-2 rotate-180 relative bottom-4"
            />
            <span
              class="text-xl font-pacifico font-normal relative -left-2 bottom-2"
            >
              Sinon en arrière !
            </span>
          </ng-container>
        </div>
        @if(isImageSelectedForThisStep$ | async) {
        <p-button
          icon="pi pi-angle-right"
          class="absolute right-8 bottom-6"
          [rounded]="true"
          (onClick)="nextStep()"
        />
        }

        <app-round-indicator [round]="round()"></app-round-indicator>
        }
      </div>
    </div>
  `,
})
export default class PickAPicturePage {
  private readonly photoService = inject(PhotoService);

  protected round = input<string>('1');
  protected readonly roundNumber$ = computed(
    () => parseInt(this.round()) as 1 | 2 | 3 | 4 | 5
  );
  private readonly round$ = toObservable(this.roundNumber$).pipe(
    distinctUntilChanged()
  );

  protected readonly imagesFromServer$ = this.round$.pipe(
    switchMap((round) =>
      statedStream(this.photoService.getImagesByRound(round))
    ),
    map((images) => {
      return images;
    }),
    shareReplay(1)
  );

  private imagesLoaded$ = this.imagesFromServer$.pipe(
    filter((images) => images.isLoaded),
    map((images) => images.result),
    toSource('[imagesStore] images$ loaded') // Annotate for Redux Dev
  );

  private readonly imagesLoading$ = this.imagesFromServer$.pipe(
    map((images) => images.isLoading),
    toSource('[imagesStore] images$ isLoading') // Annotate for Redux Devtools
  );

  protected readonly imagesStore = adapt(
    {
      images: [],
      isLoading: false,
      round: 1,
      step: 1,
      imagesToChoose: [],
    } as PickPictureState,
    {
      adapter: {
        imagesLoaded: (state, images: PickPicture[]) => ({
          ...state,
          images,
          isLoading: false,
        }),
        loadingImages: (state, isLoading: boolean) => ({ ...state, isLoading }),
        setRound: (state, round: 1 | 2 | 3 | 4 | 5) => ({ ...state, round }),
        nextStep: (state) => ({ ...state, step: ++state.step }),
        previousStep: (state) => ({ ...state, step: --state.step }),
        setImageSelected: (
          state,
          {
            indexImageSelected,
            imagesToChoose,
          }: { indexImageSelected: number; imagesToChoose: PickPicture[] }
        ) => {
          const imageSelectedId = imagesToChoose[indexImageSelected].id;
          const imageUnselectedIndex = indexImageSelected === 0 ? 1 : 0;
          const imageUnselectedId = imagesToChoose[imageUnselectedIndex].id;
          const images = state.images
            .map((image) =>
              image.id === imageSelectedId
                ? { ...image, isSelectedByTheUser: true }
                : image
            )
            .map((image) =>
              image.id === imageUnselectedId
                ? { ...image, isSelectedByTheUser: false }
                : image
            );
          return { ...state, images };
        },
        selectors: {
          isLoading: (state) => state.isLoading, // Will be memoized
          isLoaded: (state) => state.images.length && !state.isLoading, // Will be memoized
          hasAPreviousStep: ({ step }) => step > 1, // Will be memoized
          imagesToChoose: ({ step, images }) => {
            return images.slice((step - 1) * 2, (step - 1) * 2 + 2);
          }, // Will be memoized
          isImageSelectedForThisStep: ({ step, images }) => {
            const selectedImages = images.slice(
              (step - 1) * 2,
              (step - 1) * 2 + 2
            );
            return selectedImages.some((image) => image.isSelectedByTheUser);
          },
          step: (state) => state.step, // Will be memoized
          imagesSelectedId: ({ images }) =>
            images
              .filter((image) => image.isSelectedByTheUser)
              .map((image) => image.id),
          round: (state) => state.round,
          images: (state) => state.images,
        },
      },
      sources: {
        loadingImages: this.imagesLoading$,
        imagesLoaded: this.imagesLoaded$,
        setRound: this.round$.pipe(toSource('[imagesStore] images$ setRound')), // Annotate for Redux Devtools
      },
      path: 'imagesStore',
    }
  );
  isSubmitting = false;
  private router = inject(Router);
  protected submit() {
    console.log('there');
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    forkJoin({
      // imagesSelectedId: this.imagesStore.imagesSelectedId$.pipe(take(1)),
      round: this.imagesStore.round$.pipe(take(1)),
      images: this.imagesStore.images$.pipe(take(1)),
      imagesSelectedId: this.imagesStore.imagesSelectedId$.pipe(take(1)),
    })
      .pipe(
        switchMap(({ images, round, imagesSelectedId }) => {
          const userScore = images.reduce((acc, image) => {
            if (image.isSelectedByTheMainUser && image.isSelectedByTheUser) {
              return acc + 1;
            }
            return acc;
          }, 0);

          return this.photoService.submitChoices(
            imagesSelectedId,
            round,
            userScore
          );
        })
      )
      .subscribe(({ scoreTarget, userScore, round }) => {
        this.router.navigate([
          'pick-a-picture',
          'round',
          round,
          'score',
          userScore,
          'scoreTarget',
          scoreTarget,
        ]);
      });
  }

  protected isLoading$ = this.imagesStore.isLoading$;
  protected isLoaded$ = this.imagesStore.isLoaded$;
  protected imagesToChoose$ = this.imagesStore.imagesToChoose$;

  protected setImageSelected = this.imagesStore.setImageSelected;
  protected nextStep = this.imagesStore.nextStep;
  protected previousStep = this.imagesStore.previousStep;
  protected hasAPreviousStep$ = this.imagesStore.hasAPreviousStep$;
  protected isImageSelectedForThisStep$ =
    this.imagesStore.isImageSelectedForThisStep$;
  protected step$ = this.imagesStore.step$;
}
