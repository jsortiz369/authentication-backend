import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { AuthSingUpEvent } from '../../infrastructure/events';
import { JwtRepository } from 'src/shared/security/ports/jwt.repository';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';

interface Data {
  _idUser: string;
  email: string;
  names: string;
}

interface WithJwt {
  tokenConfirm: string;
}

export class AuthTokenConfirmAccountService {
  constructor(
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _cacheRepository$: CacheRepository,
    private readonly _authSingUpEvent$: AuthSingUpEvent,
    private readonly _jwtRepository$: JwtRepository,
  ) {}

  async execute(data: Data, createJwt: true): Promise<WithJwt>;
  async execute(data: Data, createJwt: false): Promise<void>;
  async execute(data: Data, createJwt: boolean = true): Promise<WithJwt | void> {
    const token = this._cryptoRepository$.token({ kind: 'NUMBER' });
    const tokenHash = this._cryptoRepository$.hash(token);
    await this._cacheRepository$.set(`confirm-account:${data._idUser}`, tokenHash, 600 * 1500); // expire in 15 minutes

    // register queue for mail sending
    await this._authSingUpEvent$.execute({ code: token, email: data.email, names: data.names });

    if (!createJwt) return;

    return {
      tokenConfirm: this._jwtRepository$.generateConfirmAccount({ sub: data._idUser }),
    };
  }
}
