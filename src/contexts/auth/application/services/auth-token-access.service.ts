import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { JwtRepository } from 'src/shared/security/ports/jwt.repository';
import { AuthCommandRepository } from '../../domain/ports/auth-command.repository';
import { Auth } from '../../domain/entities/auth.entity';
import { AuthId } from '../../domain/vo';
import { UserId } from 'src/contexts/users/domain/vo';
import { AuthRevokeSessionService } from './auth-revoke-session.service';

interface Data {
  _id: string;
  names: string;
  surnames: string;
  username: string;
  email: string;
  ip?: string | null;
  device?: string;
  browser?: string | null;
  version?: string | null;
  os?: string | null;
  userIdSession?: string | null;
  sessionId?: string | null;
}

export class AuthTokenAccessService {
  constructor(
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _jwtRepository$: JwtRepository,
    private readonly _cacheRepository$: CacheRepository,
    private readonly _authCommandRepository$: AuthCommandRepository,
    private readonly _authRevokeSessionService$: AuthRevokeSessionService,
  ) {}

  async execute(data: Data) {
    const result = this._jwtRepository$.expiresInToSeconds('generateRefresh');
    const newDate = new Date(Date.now() + result * 1000);

    const resultToken = {
      token: '',
      tokenRefresh: '',
      data: { names: data.names, surnames: data.surnames, username: data.username, email: data.email },
    };

    // validate if exist session active
    if (data.sessionId && data.userIdSession) {
      if (data.userIdSession === data._id) {
        resultToken.token = this._jwtRepository$.generate({ sub: data._id, sid: data.sessionId });
        resultToken.tokenRefresh = this._jwtRepository$.generateRefresh({ sub: data._id, sid: data.sessionId });

        await this._authCommandRepository$.updateSession(
          new AuthId(data.sessionId),
          new UserId(data.userIdSession),
          this._cryptoRepository$.hash(resultToken.tokenRefresh),
          newDate,
        );
        await this._cacheRepository$.set(`session:${data.sessionId}:user:${data.userIdSession}`, resultToken.tokenRefresh, result * 1000);
        return { ...resultToken };
      } else {
        // TODO: invalid session user
        await this._authRevokeSessionService$.execute(data.sessionId, data.userIdSession);
      }
    }

    // TODO: create new session by user
    const _idSession = this._cryptoRepository$.generateUuidV4();
    resultToken.token = this._jwtRepository$.generate({ sub: data._id, sid: _idSession });
    resultToken.tokenRefresh = this._jwtRepository$.generateRefresh({ sub: data._id, sid: _idSession });

    // TODO: prepare insert new session
    const sessionPrepare = Auth.create({
      _id: _idSession,
      userId: data._id,
      refreshTokenHash: this._cryptoRepository$.hash(resultToken.tokenRefresh),
      ip: data.ip,
      browser: data.browser,
      browserVersion: data.version,
      operatingSystem: data.os,
      device: data.device,
      expiresAt: newDate,
      revokedAt: newDate,
    });

    await this._authCommandRepository$.createSession(sessionPrepare);
    await this._cacheRepository$.set(`session:${_idSession}:user:${data._id}`, resultToken.tokenRefresh, result * 1000);

    return { ...resultToken };
  }
}
