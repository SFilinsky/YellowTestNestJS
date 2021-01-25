import { BadRequestException } from '@nestjs/common';

export class UsernameNotFoundException extends BadRequestException {
  constructor() {
    super({ message: 'Wrong username' });
  }
}
