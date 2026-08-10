import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthSingInDto } from '../dtos/auth-sing-in.dto';
import { AuthSingInHandler } from 'src/contexts/auth/application';
import { CONSTANTS } from 'src/app/constants/const.constant';
import { AuthExistSingInGuard } from '../../guards/auth-exist-sing-in.guard';

@UseGuards(AuthExistSingInGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSingInController {
  constructor(private readonly _handler$: AuthSingInHandler) {}

  @Post('/sing-in')
  @ApiOperation({ summary: 'Sing in the app' })
  @HttpCode(HttpStatus.OK)
  async execute(@Body() body: AuthSingInDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
    const ip = request.ip;
    const dataAgent = request.userAgentData;

    const result = await this._handler$.execute({
      username: body.username,
      password: body.password,
      ip: ip,
      browser: dataAgent.browser,
      device: dataAgent.device,
      os: dataAgent.os,
      version: dataAgent.version,
      userId: request?.idUser ?? null,
      sessionId: request?.idSession ?? null,
    });

    // TODO: Add cookie to response for confirm account
    if (result.confirmAccount) {
      response.setCookie(CONSTANTS.cookies.account_confirm, `Bearer ${result.token}`);
      return { message: 'Confirm your account' };
    }

    response.setCookie(CONSTANTS.cookies.access_token, `Bearer ${result.token}`);
    response.setCookie(CONSTANTS.cookies.refresh_token, `Bearer ${result.tokenRefresh}`);
    return result.data;
  }
}
