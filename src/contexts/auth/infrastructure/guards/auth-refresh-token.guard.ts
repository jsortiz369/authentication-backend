import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CONSTANTS } from 'src/app/constants/const.constant';

import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { JwtRepository } from 'src/shared/security/ports/jwt.repository';
import { NotUnauthorizedException } from '../../domain/exceptions';

@Injectable()
export class AuthRefreshTokenGuard implements CanActivate {
  constructor(
    private readonly _jwt$: JwtRepository,
    private readonly _cache$: CacheRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const jwt = this.extractTokenFromHeader(request);

    if (!jwt) throw new NotUnauthorizedException();

    try {
      const payload = this._jwt$.verifyRefresh<{ sub: string; sid: string }>(jwt);
      request.idUser = payload.sub;
      request.idSession = payload.sid;

      // TODO: check that the SID exists in cache and is correct
      const exist = await this._cache$.get(`session:${payload.sid}:user:${payload.sub}`);
      if (!exist) throw new NotUnauthorizedException();
    } catch {
      response.clearCookie(CONSTANTS.cookies.refresh_token);
      throw new NotUnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const splitted = request.cookies?.[CONSTANTS.cookies.refresh_token]?.split(' ') ?? [];
    if (!splitted || !splitted.length) return undefined;
    const [type, token] = splitted;
    return type === 'Bearer' ? token : undefined;
  }
}
