import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthRecoverPasswordDto } from '../dtos/auth-recover-password.dto';
import { AuthRecoverPasswordHandler } from 'src/contexts/auth/application';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthRecoverPasswordController {
  constructor(private readonly _handler$: AuthRecoverPasswordHandler) {}

  @ApiOperation({ summary: 'send email for recover password by username app' })
  @Post('/recover-password')
  async execute(@Body() body: AuthRecoverPasswordDto) {
    await this._handler$.execute({ username: body.username });
    return { sendToken: true };
  }
}
