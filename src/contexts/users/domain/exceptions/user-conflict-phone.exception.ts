import { ConflictException } from '@nestjs/common';

export class UserConflictPhoneException extends ConflictException {
  constructor() {
    super('A user with this phone already exists.');
  }
}
