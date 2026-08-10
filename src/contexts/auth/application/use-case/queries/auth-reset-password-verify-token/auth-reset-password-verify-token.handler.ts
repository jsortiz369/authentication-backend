import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { AuthResetPasswordVerifyTokenQuery } from './auth-reset-password-verify-token.query';
import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';

export class AuthResetPasswordVerifyTokenHandler {
  constructor(
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _cacheRepository$: CacheRepository,
  ) {}

  async execute(query: AuthResetPasswordVerifyTokenQuery) {
    const tokenHash = this._cryptoRepository$.hash(query.token);
    const idUser = await this._cacheRepository$.get<string>(`recover-password:${tokenHash}`);

    return { exist: idUser ? true : false };
  }
}
