import { Module } from '@nestjs/common';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageInfo } from './entities/imageInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageInfo])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
