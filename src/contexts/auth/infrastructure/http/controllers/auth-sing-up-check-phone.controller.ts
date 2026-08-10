import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthSingUpCheckPhoneDto } from '../dtos/auth-sing-up-check-phone.dto';
import { AuthSingUpCheckPhoneHandler } from 'src/contexts/auth/application';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSingUpCheckPhoneController {
  constructor(private readonly _handler$: AuthSingUpCheckPhoneHandler) {}

  @Get('/sing-up/check-phone')
  @ApiOperation({ summary: 'check if an phone already exists' })
  async execute(@Query() query: AuthSingUpCheckPhoneDto) {
    return await this._handler$.execute({
      phone: query.phone,
    });
  }
}
