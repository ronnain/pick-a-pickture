import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import {
  PickPicture,
  SupabaseApiService,
} from 'src/app/core/supabase-api.service';

@Injectable()
export class PhotoService {
  private readonly supabaseApiService = inject(SupabaseApiService);
  getData(): PickPicture[] {
    return [
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg',
        isSelectedByTheUser: false,
        id: 1,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
        isSelectedByTheUser: false,
        id: 2,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg',
        isSelectedByTheUser: false,
        id: 3,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg',
        isSelectedByTheUser: false,
        id: 4,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg',
        isSelectedByTheUser: false,
        id: 5,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria6.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria6s.jpg',
        isSelectedByTheUser: false,
        id: 6,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria7.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria7s.jpg',
        isSelectedByTheUser: false,
        id: 7,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria8.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria8s.jpg',
        isSelectedByTheUser: false,
        id: 8,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria9.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria9s.jpg',
        isSelectedByTheUser: false,
        id: 9,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria10s.jpg',
        isSelectedByTheUser: false,
        id: 10,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria11s.jpg',
        isSelectedByTheUser: false,
        id: 11,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria12.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria12s.jpg',
        isSelectedByTheUser: false,
        id: 12,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria13.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria13s.jpg',
        isSelectedByTheUser: false,
        id: 13,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria14.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria14s.jpg',
        isSelectedByTheUser: false,
        id: 14,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria15.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria15s.jpg',
        isSelectedByTheUser: false,
        id: 15,
      },
      {
        imageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria15.jpg',
        thumbnailImageSrc:
          'https://primefaces.org/cdn/primeng/images/galleria/galleria15s.jpg',
        isSelectedByTheUser: false,
        id: 16,
      },
    ];
  }

  getImagesByRound(round: 1 | 2 | 3 | 4 | 5) {
    return of(this.getData());
  }

  submitChoices(imagesSelectedId: number[], round: 1 | 2 | 3 | 4 | 5) {
    console.log('imagesSelectedId', imagesSelectedId);
    // todo get the result of mainUserToCompareWith
    // store the user result of the round

    return of({
      round: 1,
      userScore: 5,
      scoreTarget: 8,
    });
  }
}
