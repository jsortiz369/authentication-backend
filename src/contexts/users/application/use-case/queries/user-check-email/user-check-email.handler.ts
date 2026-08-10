import { UserQueryRepository } from 'src/contexts/users/domain/ports/user-query.repository';
import { UserCheckEmailQuery } from './user-check-email.query';

export class UserCheckEmailHandler {
  constructor(private readonly _userQueryRepository$: UserQueryRepository) {}

  async execute(query: UserCheckEmailQuery): Promise<{ available: boolean }> {
    // TODO: validate email exit
    const available = await this._userQueryRepository$.availableEmail(query.email, query.excludeId);

    return { available };
  }
}
