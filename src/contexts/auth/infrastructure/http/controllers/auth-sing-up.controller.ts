import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthSingUpDto } from '../dtos/auth-sing-up.dto';
import { AuthSingUpHandler } from 'src/contexts/auth/application';
import type { FastifyReply } from 'fastify';
import { CONSTANTS } from 'src/app/constants/const.constant';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSingUpController {
  constructor(private readonly _handler$: AuthSingUpHandler) {}

  @Post('/sing-up')
  @ApiOperation({ summary: 'Sing up the app' })
  async execute(@Body() body: AuthSingUpDto, @Res({ passthrough: true }) response: FastifyReply) {
    const result = await this._handler$.execute({
      names: body.names,
      surnames: body.surnames,
      username: body.username,
      phone: body.phone,
      email: body.email,
      password: body.password,
    });

    response.clearCookie(CONSTANTS.cookies.account_confirm);
    response.setCookie(CONSTANTS.cookies.account_confirm, `Bearer ${result.token}`);
    return { create: true };
  }
}
