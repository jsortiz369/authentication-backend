import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthRefreshTokenGuard } from '../../guards/auth-refresh-token.guard';
import { AuthRefreshTokenHandler } from 'src/contexts/auth/application';
import { CONSTANTS } from 'src/app/constants/const.constant';

@UseGuards(AuthRefreshTokenGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthRefreshTokenController {
  constructor(private readonly _handler$: AuthRefreshTokenHandler) {}

  @ApiOperation({ summary: 'refresh token session cookie app' })
  @Post('/refresh-token')
  async execute(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
    const result = await this._handler$.execute({ idSession: request?.idSession ?? '', idUser: request?.idUser ?? '' });

    response.setCookie(CONSTANTS.cookies.access_token, `Bearer ${result.token}`);
    response.setCookie(CONSTANTS.cookies.refresh_token, `Bearer ${result.tokenRefresh}`);
    return result.data;
  }
}
