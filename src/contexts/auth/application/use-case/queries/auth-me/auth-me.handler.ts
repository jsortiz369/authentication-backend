import { UserFindOneByIdService } from 'src/contexts/users/domain/services';
import { AuthMeQuery } from './auth-me.query';

export class AuthMeHandler {
  constructor(private readonly _userFindOneByIdService$: UserFindOneByIdService) {}

  async execute(query: AuthMeQuery) {
    // TODO: We get the user's data
    const user = await this._userFindOneByIdService$.execute(query.idUser);

    return {
      names: user.names,
      surnames: user.surnames,
      username: user.username,
      email: user.email,
    };
  }
}
