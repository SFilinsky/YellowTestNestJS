import { BadRequestException } from '@nestjs/common';

export class WrongFileTypeException extends BadRequestException {
  constructor() {
    super({ message: 'Wrong file type' });
  }
}
