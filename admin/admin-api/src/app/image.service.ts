import { Injectable } from "@nestjs/common";
import path from "path";
import sharp from "sharp";
import fs from 'fs';
import { Multer } from 'multer';

@Injectable()
export class ImageService {

    async store(image: Express.Multer.File) {
        const originalMetadata = await sharp(image.buffer).metadata();

        // ! The message can be stored and emitted to the client before the image is saved, and if the image saving fails, the message should be deleted. (but may appear on some client temporarily)

        const filePath = path.join("./src/assets/images");
        fs.mkdirSync(filePath, { recursive: true });

        const filename = `${image.originalname.replace(/\.\w+/, '')}`;
        const pathUpload = path.join(filePath, filename);

        await sharp(image.buffer).withMetadata().resize(800).webp().toFile(`${pathUpload}-xl.webp`);

        // if(originalMetadata.width &&  originalMetadata.height &&  originalMetadata.width > originalMetadata.height ) {
        //     await sharp(image.buffer)
        //     .withMetadata()
        //     .resize(250)
        //     .webp({ effort: 3 })
        //     .toFile(`${pathUpload}-sm.webp`);
        // } else {
        //     await sharp(image.buffer)
        //     .withMetadata()
        //     .resize(256)
        //     .webp({ effort: 3 })
        //     .toFile(`${pathUpload}-sm.webp`);
        // }

        await sharp(image.buffer)
        .withMetadata()
        .resize(250)
        .webp({ effort: 3 })
        .toFile(`${pathUpload}-sm.webp`);

        return true;
    }

}