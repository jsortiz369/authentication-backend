import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountInactiveException extends HttpException {
  constructor() {
    super('The account is inactive.', HttpStatus.LOCKED);
  }
}
