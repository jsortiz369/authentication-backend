import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { CONSTANTS } from 'src/app/constants/const.constant';
import { JwtRepository } from 'src/shared/security/ports/jwt.repository';

@Injectable()
export class AuthExistSingInGuard implements CanActivate {
  constructor(private readonly _jwt$: JwtRepository) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const jwt = this.extractTokenFromHeader(request);
    if (!jwt) return true;

    try {
      const payload = this._jwt$.verify<{ sid: string; sub: string }>(jwt);
      request.idUser = payload.sub;
      request.idSession = payload.sid;
    } catch {
      return true;
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const splitted = request.cookies?.[CONSTANTS.cookies.access_token]?.split(' ') ?? [];
    if (!splitted || !splitted.length) return undefined;
    const [type, token] = splitted;
    return type === 'Bearer' ? token : undefined;
  }
}
