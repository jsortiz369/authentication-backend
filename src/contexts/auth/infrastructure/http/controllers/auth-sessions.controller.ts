import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';

import { ROUTES } from 'src/app/constants/routes.constant';
import { CONSTANTS } from 'src/app/constants/const.constant';
import { AuthSingInGuard } from '../../guards/auth-sing-in.guard';
import { AuthSessionsHandler } from 'src/contexts/auth/application/use-case/queries/auth-sessions/auth-sessions.handler';

@UseGuards(AuthSingInGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSessionsController {
  constructor(private readonly _handler$: AuthSessionsHandler) {}

  @Get('/sessions')
  @ApiCookieAuth(CONSTANTS.cookies.access_token)
  @ApiOperation({ summary: 'List all active sessions for the authenticated user' })
  async execute(@Req() request: FastifyRequest) {
    return await this._handler$.execute({
      idUser: request.idUser ?? '',
      currentSessionId: request.idSession ?? '',
    });
  }
}
