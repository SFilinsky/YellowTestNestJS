import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageInfo } from '../entities/imageInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Stream } from 'stream';
import { FileReadException } from '../../../core/exceptions/exceptions/file-read.exception';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageInfo) protected repo: Repository<ImageInfo>,
  ) {}

  async saveFileInfo(
    originalName: string,
    destination: string,
    fileName: string,
    path: string,
    size: number,
  ): Promise<any> {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(ImageInfo, [
        'originalName',
        'destination',
        'fileName',
        'path',
        'size',
      ])
      .values([
        {
          originalName: originalName,
          destination: destination,
          fileName: fileName,
          path: path,
          size: size,
        },
      ])
      .execute()
      .then((result) => {
        const resultObj = result.identifiers.pop();
        if (!resultObj || !resultObj.id) {
          throw Error('Result expected to have id');
        }
        return resultObj.id;
      });
  }

  async getImageList() {
    return this.repo.find().then((images) =>
      images.map((image) => ({
        id: image.id,
        fileName: image.originalName,
      })),
    );
  }

  async getImage(id: string): Promise<ImageInfo> {
    const image = await this.repo.findOne(id);
    if (!image) {
      throw new NotFoundException(`Image with id = ${id} not found`);
    }
    return image;
  }

  readImage(path: string): Stream {
    try {
      return fs.createReadStream(path);
    } catch {
      throw new FileReadException();
    }
  }
}
