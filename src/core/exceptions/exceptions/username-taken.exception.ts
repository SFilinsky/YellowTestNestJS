import { BadRequestException } from '@nestjs/common';

export class UsernameTakenException extends BadRequestException {
  constructor() {
    super({ message: 'Username already taken' });
  }
}
