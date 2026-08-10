import { UnauthorizedException } from '@nestjs/common';

export class NotUnauthorizedConfirmException extends UnauthorizedException {
  constructor() {
    super('Unauthorized: The user is not authorized for this action.');
  }
}
