import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';

import { ROUTES } from 'src/app/constants/routes.constant';
import { CONSTANTS } from 'src/app/constants/const.constant';
import { AuthSingInGuard } from '../../guards/auth-sing-in.guard';
import { AuthRevokeSessionHandler } from 'src/contexts/auth/application/use-case/commands/auth-revoke-session/auth-revoke-session.handler';

@UseGuards(AuthSingInGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthRevokeSessionController {
  constructor(private readonly _handler$: AuthRevokeSessionHandler) {}

  @Delete('/sessions/:sessionId')
  @ApiCookieAuth(CONSTANTS.cookies.access_token)
  @ApiParam({ name: 'sessionId', description: 'ID of the session to revoke' })
  @ApiOperation({ summary: 'Revoke a specific session (close it remotely)' })
  async execute(@Param('sessionId') sessionId: string, @Req() request: FastifyRequest) {
    await this._handler$.execute({
      idUser: request.idUser ?? '',
      sessionIdToRevoke: sessionId,
      currentSessionId: request.idSession ?? '',
    });

    return { revoked: true };
  }
}
