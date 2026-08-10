import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthSingUpCheckEmailDto } from '../dtos/auth-sing-up-check-email.dto';
import { AuthSingUpCheckEmailHandler } from 'src/contexts/auth/application';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSingUpCheckEmailController {
  constructor(private readonly _handler$: AuthSingUpCheckEmailHandler) {}

  @Get('/sing-up/check-email')
  @ApiOperation({ summary: 'check if an email already exists' })
  async execute(@Query() query: AuthSingUpCheckEmailDto) {
    return await this._handler$.execute({
      email: query.email,
    });
  }
}
