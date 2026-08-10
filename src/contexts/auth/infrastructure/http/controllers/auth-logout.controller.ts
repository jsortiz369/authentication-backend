import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { AuthSingInGuard } from '../../guards/auth-sing-in.guard';
import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthLogoutHandler } from 'src/contexts/auth/application';

@UseGuards(AuthSingInGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthLogoutController {
  constructor(private readonly _handler$: AuthLogoutHandler) {}

  @Post('/logout')
  @ApiOperation({ summary: 'Logout app' })
  async execute(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
    await this._handler$.execute({ idUser: request?.idUser ?? '', idSession: request?.idSession ?? '' });

    // TODO: delete session cache
    const cookieNames = request.headers?.cookie?.split(';').map((cookie) => cookie.split('=')[0].trim());
    cookieNames?.forEach((cookieName) => {
      response.clearCookie(cookieName);
    });

    return { logout: true };
  }
}
