import { UnauthorizedException } from '@nestjs/common';

export class NotUnauthorizedException extends UnauthorizedException {
  constructor() {
    super('You are not authorized to perform this action.');
  }
}
