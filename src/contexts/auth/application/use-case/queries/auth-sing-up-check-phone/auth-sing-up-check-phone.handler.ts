import { AuthSingUpCheckPhoneQuery } from './auth-sing-up-check-phone.query';
import { UserCheckPhoneHandler } from 'src/contexts/users/application';

export class AuthSingUpCheckPhoneHandler {
  constructor(private readonly _checkPhone$: UserCheckPhoneHandler) {}

  async execute(query: AuthSingUpCheckPhoneQuery): Promise<{ available: boolean }> {
    // TODO: check if phone is available
    const available = await this._checkPhone$.execute({ phone: query.phone });

    return available;
  }
}
