import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { AuthResetPasswordCommand } from './auth-reset-password.command';
import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { NotExistTokenRecovePasswordException } from 'src/contexts/auth/domain/exceptions';
import { UserFindOneByIdService } from 'src/contexts/users/domain/services';
import { UserPasswordCreateHandler } from 'src/contexts/users-passwords/application';

export class AuthResetPasswordHandler {
  constructor(
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _cacheRepository$: CacheRepository,
    private readonly _userFindOneByIdService$: UserFindOneByIdService,
    private readonly _passwordCreateHandler$: UserPasswordCreateHandler,
  ) {}

  async execute(command: AuthResetPasswordCommand) {
    // TODO: validate token
    const tokenHash = this._cryptoRepository$.hash(command.token);
    const idUser = await this._cacheRepository$.get<string>(`recover-password:${tokenHash}`);

    // TODO: validate exist idUser
    if (!idUser) throw new NotExistTokenRecovePasswordException();

    // TODO: valdate exists user by id
    const user = await this._userFindOneByIdService$.execute(idUser);

    // TODO: Insert new password
    await this._passwordCreateHandler$.execute({ password: command.password, userId: user._id });
  }
}
