import { ConflictException } from '@nestjs/common';

export class AccountAlreadyConfirmedException extends ConflictException {
  constructor() {
    super('The account has already been confirmed previously.');
  }
}
