import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountLockException extends HttpException {
  constructor() {
    super('The account is locked due to several failed attempts, you need to wait 15 minutes.', HttpStatus.LOCKED);
  }
}
