import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';

import { CONSTANTS } from 'src/app/constants/const.constant';
import { ROUTES } from 'src/app/constants/routes.constant';
import { SingUpConfirmGuard } from '../../guards/auth-sing-up-confirm.guard';
import { AuthSingUpResendTokenConfirmHandler } from 'src/contexts/auth/application';

@UseGuards(SingUpConfirmGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSingUpResendTokenConfirmController {
  constructor(private readonly _handler$: AuthSingUpResendTokenConfirmHandler) {}

  @Post('/sing-up/resend-token-confirm')
  @ApiCookieAuth(CONSTANTS.cookies.account_confirm)
  @ApiOperation({ summary: 'resend token confirm account' })
  async execute(@Req() request: FastifyRequest) {
    await this._handler$.execute({ idUser: request?.idUser ?? '' });
    return { sendToken: true };
  }
}
