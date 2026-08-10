import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthSingInGuard } from '../../guards/auth-sing-in.guard';
import { AuthMeHandler } from 'src/contexts/auth/application';

@UseGuards(AuthSingInGuard)
@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthMeController {
  constructor(private readonly _handler$: AuthMeHandler) {}

  @Get('/me')
  @ApiOperation({ summary: 'Data me auth app' })
  async execute(@Req() request: FastifyRequest) {
    return await this._handler$.execute({ idUser: request?.idUser ?? '' });
  }
}
