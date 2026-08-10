import { UnauthorizedException } from '@nestjs/common';

export class IncorrectCredentialsException extends UnauthorizedException {
  constructor() {
    super('Incorrect username and/or password.');
  }
}
