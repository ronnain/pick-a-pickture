import { inject, Injectable } from '@angular/core';
import { defer, from, map, Observable, of, take } from 'rxjs';
import {
  PickPicture,
  SupabaseApiService,
} from '../../core/supabase-api.service';
import { UserService } from '../../core/user.service';

@Injectable()
export abstract class PhotoService {
  abstract getImagesByRound(round: 1 | 2 | 3 | 4 | 5): Observable<PickPicture[]>;

  abstract submitChoices(imagesSelectedId: number[], round: 1 | 2 | 3 | 4 | 5, userScore: number): Observable<{
    round: number;
    userScore: number;
    scoreTarget: number;
}>;
}

@Injectable()
export class UserPhotoService implements PhotoService {
  private readonly supabaseApiService = inject(SupabaseApiService);
  private readonly userService = inject(UserService);

  getImagesByRound(round: 1 | 2 | 3 | 4 | 5) {
    return from(this.supabaseApiService.getImageToPicked(round)).pipe(
      take(1),
      map(result => result.data),
      map((images) => {
        if(!images) {
          return [];
        }
        const imagesData = images as any as PickPicture[];
        return imagesData.map((image) => ({
          id: image.id,
          thumbnailImageSrc: `assets/images/${image.id}-sm.webp`,
          imageSrc: `assets/images/${image.id}-xl.webp`,
          isSelectedByTheMainUser: image.isSelectedByTheMainUser,
          isSelectedByTheUser: false
        }));
      })
    );
  }

  submitChoices(imagesSelectedId: number[], round: 1 | 2 | 3 | 4 | 5, userScore: number) {
    console.log('imagesSelectedId', imagesSelectedId);
    // store the user result of the round
    return from(this.supabaseApiService.storeUserScore(round, this.userService.getUserName(), userScore)).pipe(
      take(1),
      map(() => ({
        round: round,
        userScore: userScore,
        scoreTarget: 32/(2**round),
      }))
    );
  }
}


@Injectable()
export class MainUserPhotoService implements PhotoService {
  private readonly supabaseApiService = inject(SupabaseApiService);


  getImagesByRound(round: 1 | 2 | 3 | 4 | 5) {
    return from(defer(() => this.supabaseApiService.getImageToPicked(round ))).pipe(
      take(1),
      map(result => result.data),
      map((images) => {
        if(!images) {
          return [];
        }
        const imagesData = images as any as PickPicture[];
        return imagesData.map((image) => ({
          id: image.id,
          thumbnailImageSrc: `assets/images/${image.id}-sm.webp`,
          imageSrc: `assets/images/${image.id}-xl.webp`,
          isSelectedByTheMainUser: image.isSelectedByTheMainUser,
          isSelectedByTheUser: false
        }));
      })
    );
  }

  submitChoices(imagesSelectedId: number[], round: 1 | 2 | 3 | 4 | 5) {
    console.log('imagesSelectedId', imagesSelectedId);

    return from(defer(() => this.supabaseApiService.storeImagePicked(round, imagesSelectedId ))).pipe(
      take(1),
      map(() => ({
        round: round,
        userScore: 32/(2**round),
        scoreTarget: 32/(2**round),
      }))
    );
  }
}