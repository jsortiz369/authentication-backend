import { Body, Controller, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthSingUpConfirmHandler } from 'src/contexts/auth/application';
import { SingUpConfirmGuard } from '../../guards/auth-sing-up-confirm.guard';
import { CONSTANTS } from 'src/app/constants/const.constant';
import { AuthExistSingInGuard } from '../../guards/auth-exist-sing-in.guard';
import { AuthSingUpConfirmDto } from '../dtos/auth-sing-up-confirm.dto';

@UseGuards(AuthExistSingInGuard, SingUpConfirmGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSingUpConfirmController {
  constructor(private readonly _handler$: AuthSingUpConfirmHandler) {}

  @Patch('/sing-up/confirm')
  @ApiCookieAuth(CONSTANTS.cookies.account_confirm)
  @ApiOperation({ summary: 'confirm account' })
  async execute(@Body() body: AuthSingUpConfirmDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
    const ip = request.ip;
    const dataAgent = request.userAgentData;

    const result = await this._handler$.execute({
      idUser: request.idUser ?? '',
      otp: body.token,
      ip: ip,
      browser: dataAgent.browser,
      device: dataAgent.device,
      os: dataAgent.os,
      version: dataAgent.version,
      userId: request?.idUser ?? null,
      sessionId: request?.idSession ?? null,
    });

    response.clearCookie(CONSTANTS.cookies.account_confirm);
    response.clearCookie(CONSTANTS.cookies.access_token);
    response.clearCookie(CONSTANTS.cookies.refresh_token);
    response.setCookie(CONSTANTS.cookies.access_token, `Bearer ${result.token}`);
    response.setCookie(CONSTANTS.cookies.refresh_token, `Bearer ${result.tokenRefresh}`);
    return result.data;
  }
}
