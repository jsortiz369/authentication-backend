import { AuthSingUpCheckUsernameQuery } from './auth-sing-up-check-username.query';
import { UserCheckUsernameHandler } from 'src/contexts/users/application';

export class AuthSingUpCheckUsernameHandler {
  constructor(private readonly _checkUsername$: UserCheckUsernameHandler) {}

  async execute(query: AuthSingUpCheckUsernameQuery): Promise<{ available: boolean }> {
    // TODO: check if username is available
    const available = await this._checkUsername$.execute({ username: query.username });

    return available;
  }
}
