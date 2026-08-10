import { UserSingInService } from 'src/contexts/users/domain/services';
import { AuthRecoverPasswordCommand } from './auth-recover-password.command';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { AuthRecoverPasswordEvent } from 'src/contexts/auth/infrastructure/events';

export class AuthRecoverPasswordHandler {
  constructor(
    private readonly _userForSingInService$: UserSingInService,
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _cacheRepository$: CacheRepository,
    private readonly _authRecoverPasswordEvent$: AuthRecoverPasswordEvent,
  ) {}

  async execute(command: AuthRecoverPasswordCommand) {
    // TODO: validate existe user
    const user = await this._userForSingInService$.execute(command.username);
    if (!user || !user.confirmed || !user.status) return; // TODO: user not exist or not confirm account or inactive

    const token = this._cryptoRepository$.token({ kind: 'ALPHANUMERIC' });
    const tokenHash = this._cryptoRepository$.hash(token);
    await this._cacheRepository$.set(`recover-password:${tokenHash}`, user._id, 600 * 1500);

    // register queue for mail sending
    await this._authRecoverPasswordEvent$.execute({ token, email: user.email, names: `${user.names} ${user.surnames}` });
  }
}
