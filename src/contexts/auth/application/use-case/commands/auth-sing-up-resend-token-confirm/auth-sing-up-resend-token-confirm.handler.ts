import { UserFindOneByIdService } from 'src/contexts/users/domain/services';
import { AuthSingUpResendTokenConfirmCommand } from './auth-sing-up-resend-token-confirm.command';
import { AccountAlreadyConfirmedException } from 'src/contexts/auth/domain/exceptions';
import { AuthTokenConfirmAccountService } from '../../../services';

export class AuthSingUpResendTokenConfirmHandler {
  constructor(
    private readonly _userFindOneByIdService$: UserFindOneByIdService,
    private readonly _authTokenConfirmAccountService$: AuthTokenConfirmAccountService,
  ) {}

  async execute(command: AuthSingUpResendTokenConfirmCommand) {
    // TODO: valdate exists user by id
    const user = await this._userFindOneByIdService$.execute(command.idUser);

    // TODO: validate user hasn't confirmed account
    if (user.confirmed) throw new AccountAlreadyConfirmedException();

    await this._authTokenConfirmAccountService$.execute(
      {
        _idUser: user._id,
        email: user.email,
        names: `${user.names} ${user.surnames}`,
      },
      false,
    );
  }
}
