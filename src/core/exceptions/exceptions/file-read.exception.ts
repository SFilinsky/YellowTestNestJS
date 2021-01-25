import { InternalServerErrorException } from '@nestjs/common';

export class FileReadException extends InternalServerErrorException {
  constructor() {
    super({ message: 'Could not read file' });
  }
}
