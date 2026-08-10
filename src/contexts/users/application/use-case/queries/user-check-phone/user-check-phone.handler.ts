import { UserQueryRepository } from 'src/contexts/users/domain/ports/user-query.repository';
import { UserCheckPhoneQuery } from './user-check-phone.query';

export class UserCheckPhoneHandler {
  constructor(private readonly _userQueryRepository$: UserQueryRepository) {}

  async execute(query: UserCheckPhoneQuery): Promise<{ available: boolean }> {
    // TODO: validate phone exit
    const available = await this._userQueryRepository$.availablePhone(query.phone, query.excludeId);

    return { available };
  }
}
