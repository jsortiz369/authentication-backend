import { UserPasswordQueryRepository } from '../ports';
import { UserPasswordCurrentProjection } from '../projections';

export class UserPasswordByIdUserService {
  constructor(private readonly _userPasswordQueryRepository$: UserPasswordQueryRepository) {}

  async execute(idUser: string): Promise<UserPasswordCurrentProjection | null> {
    return await this._userPasswordQueryRepository$.findCurrentByIdUser(idUser);
  }
}
