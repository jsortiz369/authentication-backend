import { AuthSingUpCheckEmailQuery } from './auth-sing-up-check-email.query';
import { UserCheckEmailHandler } from 'src/contexts/users/application';

export class AuthSingUpCheckEmailHandler {
  constructor(private readonly _checkEmail$: UserCheckEmailHandler) {}

  async execute(query: AuthSingUpCheckEmailQuery): Promise<{ available: boolean }> {
    // TODO: check if email is available
    const available = await this._checkEmail$.execute({ email: query.email });

    return available;
  }
}
