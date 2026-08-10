import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { JwtRepository } from 'src/shared/security/ports/jwt.repository';
import { NotUnauthorizedConfirmException } from '../../domain/exceptions';
import { CONSTANTS } from 'src/app/constants/const.constant';

@Injectable()
export class SingUpConfirmGuard implements CanActivate {
  constructor(private readonly _jwt$: JwtRepository) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();
    const jwt = this.extractTokenFromHeader(request);

    if (!jwt) throw new NotUnauthorizedConfirmException();

    try {
      const payload = this._jwt$.verifyConfirmAccount(jwt);
      request.idUser = payload.sub;
    } catch {
      response.clearCookie(CONSTANTS.cookies.account_confirm);
      throw new NotUnauthorizedConfirmException();
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const splitted = request.cookies?.[CONSTANTS.cookies.account_confirm]?.split(' ') ?? [];
    if (!splitted || !splitted.length) return undefined;
    const [type, token] = splitted;
    return type === 'Bearer' ? token : undefined;
  }
}
