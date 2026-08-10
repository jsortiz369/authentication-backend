import { BadRequestException } from '@nestjs/common';

export class UserPasswordConflictCreatePasswordException extends BadRequestException {
  constructor() {
    super(`For security, you can't reuse any of your last 3 passwords.`);
  }
}
