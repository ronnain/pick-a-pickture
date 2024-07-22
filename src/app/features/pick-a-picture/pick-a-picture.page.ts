import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { PhotoService } from './photo.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, forkJoin, map, shareReplay, switchMap, take } from 'rxjs';
import { adapt } from '@state-adapt/angular';
import { toSource } from '@state-adapt/rxjs';
import { statedStream } from 'src/app/util/rxjs-stated-stream';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router, RouterModule } from '@angular/router';
import { PickPicture } from 'src/app/core/supabase-api.service';

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
  imports: [
    CommonModule,
    ImageModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    RouterModule,
  ],
  providers: [PhotoService],
  template: `
    <div class="">
      <div
        class="h-screen w-screen flex flex-col items-center justify-center  py-2"
      >
        <div class="">
          <h1 class="text-2xl">Devine l'image choisi par Laura</h1>
          <span>Round {{ round() }} -</span
          ><span> Clique sur l'image pour l'agrandir</span>
        </div>
        @if (isLoading$ | async) {
        <div class="h-screen w-screen flex items-center justify-center">
          <p-progressSpinner></p-progressSpinner>
        </div>
        } @if (isLoaded$ | async) {

        <div
          class="flex-1 flex flex-col items-center justify-center gap-2"
          *ngIf="imagesToChoose$ | async as imagesToChoose"
        >
          @for (image of imagesToChoose; track image.id; let index = $index) {
          <div class="shadow-md p-2 rounded">
            <div class="flex flex-col justify-center items-center gap-2">
              <p-image
                class="flex-1"
                [src]="image.thumbnailImageSrc"
                [previewImageSrc]="image.imageSrc"
                width="250"
                [preview]="true"
              />
              <p-button
                [icon]="image.isSelectedByTheUser ? 'pi pi-check' : ''"
                label="Sélectionner"
                [rounded]="true"
                (onClick)="
                  setImageSelected({
                    indexImageSelected: index,
                    imagesToChoose
                  });
                  nextStep()
                "
              />
            </div>
          </div>
          } @empty {
          <p-button
            label="Soumettre mes choix !"
            [raised]="true"
            severity="warning"
            (onClick)="submit()"
          />
          }
        </div>

        <div class="flex items-center gap-2">
          <p-button label="Accueil" [text]="true" [routerLink]="['']" />
          <p-button
            label="Retour"
            [text]="true"
            (onClick)="previousStep()"
            [disabled]="(hasAPreviousStep$ | async) === false"
          />
          @if(isImageSelectedForThisStep$ | async) {
          <p-button label="Suivant" [text]="true" (onClick)="nextStep()" />
          }
        </div>
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
  private readonly round$ = toObservable(this.roundNumber$);

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
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    forkJoin({
      imagesSelectedId: this.imagesStore.imagesSelectedId$.pipe(take(1)),
      round: this.imagesStore.round$.pipe(take(1)),
    })
      .pipe(
        switchMap(({ imagesSelectedId, round }) =>
          this.photoService.submitChoices(imagesSelectedId, round)
        )
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
