import { ConflictException } from '@nestjs/common';

export class UserConflictEmailException extends ConflictException {
  constructor() {
    super('A user with this email already exists.');
  }
}
