import { UserQueryRepository } from '../ports/user-query.repository';
import { UserSingInProjection } from '../projections/user-sing-in.projection';

export class UserSingInService {
  constructor(private readonly _userQueryRepository$: UserQueryRepository) {}

  async execute(username: string): Promise<UserSingInProjection | null> {
    // TODO: Check if user exist
    const user = await this._userQueryRepository$.findOneForSingIn(username);
    if (!user) return null;

    return user;
  }
}
