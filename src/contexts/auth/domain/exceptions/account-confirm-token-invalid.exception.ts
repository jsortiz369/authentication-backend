import { BadRequestException } from '@nestjs/common';

export class AccountConfirmTokenInvalidException extends BadRequestException {
  constructor() {
    super('Account confirm token is invalid');
  }
}
