import { UserFindOneByIdService, UserUpdateConfirmService } from 'src/contexts/users/domain/services';
import { AuthSingUpConfirmCommand } from './auth-sing-up-confirm.command';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { AccountAlreadyConfirmedException, AccountConfirmTokenInvalidException } from 'src/contexts/auth/domain/exceptions';
import { AuthTokenAccessService } from '../../../services';

export class AuthSingUpConfirmHandler {
  constructor(
    private readonly _userFindOneByIdService$: UserFindOneByIdService,
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _cacheRepository$: CacheRepository,
    private readonly _userUpdateConfirmService$: UserUpdateConfirmService,
    private readonly _authTokenAccessService$: AuthTokenAccessService,
  ) {}

  async execute(command: AuthSingUpConfirmCommand) {
    // TODO: valdate exists user by id
    const user = await this._userFindOneByIdService$.execute(command.idUser);

    // TODO: validate user hasn't confirmed account
    if (user.confirmed) throw new AccountAlreadyConfirmedException();

    // TODO: validate token exists by user id and compare token
    const tokenHash = this._cryptoRepository$.hash(command.otp);
    const tokenComparison = await this._cacheRepository$.get<string>(`confirm-account:${command.idUser}`);

    // TODO: validate token equals
    if (tokenHash !== tokenComparison) throw new AccountConfirmTokenInvalidException();

    // TODO: confirm account
    await this._userUpdateConfirmService$.execute(command.idUser);

    // TODO: delete token
    await this._cacheRepository$.delete(`confirm-account:${command.idUser}`);

    return await this._authTokenAccessService$.execute({
      ...user,
      ip: command.ip,
      browser: command.browser,
      version: command.version,
      os: command.os,
      device: command.device,
      sessionId: command.sessionId,
      userIdSession: command.userId,
    });
  }
}
