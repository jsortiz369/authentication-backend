import { UserPasswordFindAllByIdUserProjection } from '../projections/user-password-find-all-by-id-user.projection';
import { UserPasswordCurrentProjection } from '../projections/user-password-current-by-id-user.projection';

export abstract class UserPasswordQueryRepository {
  abstract findCurrentByIdUser(idUser: string): Promise<UserPasswordCurrentProjection | null>;

  abstract findAllByIdUser(idUser: string, limit: number): Promise<UserPasswordFindAllByIdUserProjection[]>;
}
