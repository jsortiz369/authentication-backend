import { ConflictException } from '@nestjs/common';

export class UserConflictUsernameException extends ConflictException {
  constructor() {
    super('A user with this username already exists.');
  }
}
