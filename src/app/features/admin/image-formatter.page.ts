import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mergeMap, Subject } from 'rxjs';

@Component({
    selector: 'app-image-formatter',
    standalone: true,
    imports: [
    CommonModule,
    ],
    template: `
    <div class="h-page min-h-page w-screen flex items-center justify-center">
    <input
              #PicturesInput
              type="file"
              id="fileInput"
              (change)="onAddPictures($event.target)"
              accept=".jpg, .jpeg, .png, .gif .webp, .svg"
              multiple
              >
    </div>

    `
})
export default class ImageFormatterPage {

    private readonly storePictures$ = new Subject<File[]>();
    private readonly httpClient = inject(HttpClient);


    constructor() {

        this.storePictures$.pipe(
            mergeMap((files) => {
                console.log('storePictures files', files);

                const formData = new FormData();
                files.forEach(file => {
      formData.append('files', file, file.name);
    });
                return this.httpClient.post(' http://localhost:3000/api/upload', formData);
            }),
            takeUntilDestroyed()
        ).subscribe((files) => {

        });

    }

    onAddPictures(target: EventTarget | null) {
        if (!target) {
            return;
        }

        const files = (target as HTMLInputElement).files;

        if (!files) {
            return;
        }
        const filesToUpload: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (!file) {
                continue;
            }
            filesToUpload.push(file);
        }

        // console.log('filesToUpload', filesToUpload);

        this.storePictures$.next(filesToUpload);
    }

}