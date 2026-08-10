import { UserQueryRepository } from 'src/contexts/users/domain/ports/user-query.repository';
import { UserCheckUsernameQuery } from './user-check-username.query';

export class UserCheckUsernameHandler {
  constructor(private readonly _userQueryRepository$: UserQueryRepository) {}

  async execute(query: UserCheckUsernameQuery): Promise<{ available: boolean }> {
    // TODO: validate username exit
    const available = await this._userQueryRepository$.availableUsername(query.username, query.excludeId);

    return { available };
  }
}
