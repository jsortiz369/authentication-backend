import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthResetPasswordDto } from '../dtos/auth-reset-password.dto';
import { AuthResetPasswordHandler } from 'src/contexts/auth/application';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthResetPasswordController {
  constructor(private readonly _handler$: AuthResetPasswordHandler) {}

  @ApiOperation({ summary: 'reset password app' })
  @Post('/reset-password')
  async execute(@Body() body: AuthResetPasswordDto) {
    await this._handler$.execute({ password: body.password, token: body.token });
    return { reset: true };
  }
}
