import { Controller, Get, UseInterceptors, UploadedFile, Post, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ImageService } from './image.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private imageService: ImageService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }


  @Post('upload')
@UseInterceptors(FilesInterceptor('files'))
async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {

   try {
    files.forEach(async file => {
      await this.imageService.store(
        file);
    });
      return { status: 200, body: true };

    } catch (error) {
      console.error(error);
      return { status: 400, body: error };
    }
}
}
