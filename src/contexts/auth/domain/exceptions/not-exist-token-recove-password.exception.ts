import { BadRequestException } from '@nestjs/common';

export class NotExistTokenRecovePasswordException extends BadRequestException {
  constructor() {
    super('Not exist token for recover password');
  }
}
