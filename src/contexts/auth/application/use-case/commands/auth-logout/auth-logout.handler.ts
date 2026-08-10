import { UserFindOneByIdService } from 'src/contexts/users/domain/services';
import { AuthLogoutCommand } from './auth-logout.command';
import { AuthRevokeSessionService } from '../../../services/auth-revoke-session.service';

export class AuthLogoutHandler {
  constructor(
    private readonly _userFindOneByIdService$: UserFindOneByIdService,
    private readonly _authRevokeSessionService$: AuthRevokeSessionService,
  ) {}

  async execute(command: AuthLogoutCommand) {
    // TODO: We get the user's data
    await this._userFindOneByIdService$.execute(command.idUser);

    // TODO: revoke the session
    await this._authRevokeSessionService$.execute(command.idSession, command.idUser);
  }
}
