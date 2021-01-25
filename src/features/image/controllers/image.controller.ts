import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageService } from '../services/image.service';
import { WrongFileTypeException } from '../../../core/exceptions/exceptions/wrong-file-type.exception';
import { Response } from 'express';
import { FileReadException } from '../../../core/exceptions/exceptions/file-read.exception';

@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg') {
        return cb(null, true);
      }
      return cb(new WrongFileTypeException(), false);
    },
    storage: diskStorage({
      filename: (req, file, cb) => {
        const fileNameSplit = file.originalname.split('.');
        const fileExt = fileNameSplit[fileNameSplit.length - 1];
        cb(null, `${Date.now()}.${fileExt}`);
      },
    }),
  }),
)
@Controller('image')
export class ImageController {
  constructor(protected imageService: ImageService) {}

  @Post('upload')
  async uploadFile(@UploadedFile() file: any) {
    return this.imageService.saveFileInfo(
      file.originalname,
      file.destination,
      file.filename,
      file.path,
      file.size,
    );
  }

  @Get()
  async getFileList() {
    return this.imageService.getImageList();
  }

  @Get(':id')
  @Header('Content-type', 'image/jpeg')
  async downloadFile(@Res() res: Response, @Param('id') id: string) {
    const image = await this.imageService.getImage(id);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${image.fileName}`,
    );
    try {
      this.imageService.readImage(image.path).pipe(res);
    } catch {
      throw new FileReadException();
    }
  }
}
