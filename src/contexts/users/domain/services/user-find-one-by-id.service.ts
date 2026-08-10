import { UserNotFoundException } from '../exceptions';
import { UserQueryRepository } from '../ports/user-query.repository';
import { UserFindOneByIdProjection } from '../projections/user-find-one-by-id.projection';

export class UserFindOneByIdService {
  constructor(private readonly _userQueryRepository$: UserQueryRepository) {}

  async execute(id: string): Promise<UserFindOneByIdProjection> {
    const user = await this._userQueryRepository$.findOneById(id);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
