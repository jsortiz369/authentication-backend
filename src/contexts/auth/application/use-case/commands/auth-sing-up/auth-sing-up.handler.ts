import { UserCreateHandler } from 'src/contexts/users/application';
import { AuthSingUpCommand } from './auth-sing-up.command';
import { AuthTokenConfirmAccountService } from '../../../services';

export class AuthSingUpHandler {
  constructor(
    private readonly _userCreateHandler$: UserCreateHandler,
    private readonly _authTokenConfirmAccountService$: AuthTokenConfirmAccountService,
  ) {}

  async execute(command: AuthSingUpCommand) {
    // Create user
    const userCreated = await this._userCreateHandler$.execute(command);
    const userPrimitive = userCreated.toValuesPrimitives();

    const { tokenConfirm } = await this._authTokenConfirmAccountService$.execute(
      {
        _idUser: userPrimitive._id,
        email: userPrimitive.email,
        names: `${userPrimitive.names} ${userPrimitive.surnames}`,
      },
      true,
    );

    return { token: tokenConfirm };
  }
}
