import { JwtRepository } from 'src/shared/security/ports/jwt.repository';
import { AuthRefreshTokenCommand } from './auth-refresh-token.command';
import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { UserFindOneByIdService } from 'src/contexts/users/domain/services';
import { AuthCommandRepository } from 'src/contexts/auth/domain/ports/auth-command.repository';
import { AuthId } from 'src/contexts/auth/domain/vo';
import { UserId } from 'src/contexts/users/domain/vo';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';

export class AuthRefreshTokenHandler {
  constructor(
    private readonly _userFindOneByIdService$: UserFindOneByIdService,
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _jwtRepository$: JwtRepository,
    private readonly _cacheRepository$: CacheRepository,
    private readonly _authCommandRepository$: AuthCommandRepository,
  ) {}

  async execute(command: AuthRefreshTokenCommand) {
    // TODO: We get the user's data
    const user = await this._userFindOneByIdService$.execute(command.idUser);

    // TODO: get the expiration time
    const result = this._jwtRepository$.expiresInToSeconds('generateRefresh');
    const newDate = new Date(Date.now() + result * 1000);

    const token = this._jwtRepository$.generate({ sub: user._id, sid: command.idSession });
    const tokenRefresh = this._jwtRepository$.generateRefresh({ sub: user._id, sid: command.idSession });

    await this._authCommandRepository$.updateSession(
      new AuthId(command.idSession),
      new UserId(user._id),
      this._cryptoRepository$.hash(tokenRefresh),
      newDate,
    );
    await this._cacheRepository$.set(`session:${command.idSession}:user:${user._id}`, tokenRefresh, result * 1000);

    return {
      token,
      tokenRefresh,
      data: { names: user.names, surnames: user.surnames, username: user.username, email: user.email },
    };
  }
}
