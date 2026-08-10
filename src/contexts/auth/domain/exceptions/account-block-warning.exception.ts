import { UnauthorizedException } from '@nestjs/common';

export class AccountBlockWarningException extends UnauthorizedException {
  constructor() {
    super('After the next failed attempt, the account will be locked');
  }
}
