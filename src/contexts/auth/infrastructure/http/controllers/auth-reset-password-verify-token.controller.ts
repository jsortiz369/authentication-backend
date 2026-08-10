import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthResetPasswordVerifyTokenDto } from '../dtos/auth-reset-password-verify-token.dto';
import { AuthResetPasswordVerifyTokenHandler } from 'src/contexts/auth/application';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthResetPasswordVerifyTokenController {
  constructor(private readonly _handler$: AuthResetPasswordVerifyTokenHandler) {}

  @ApiOperation({ summary: 'verify token for reset password app' })
  @Get('/reset-password-verify-token')
  async execute(@Query() query: AuthResetPasswordVerifyTokenDto) {
    return await this._handler$.execute(query);
  }
}
