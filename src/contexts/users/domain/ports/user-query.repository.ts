import { UserFindOneByIdProjection } from '../projections/user-find-one-by-id.projection';
import { UserSingInProjection } from '../projections/user-sing-in.projection';

export abstract class UserQueryRepository {
  abstract findOneById(id: string): Promise<UserFindOneByIdProjection | null>;

  abstract findOneForSingIn(usernameOrEmail: string): Promise<UserSingInProjection | null>;

  abstract availableUsername(username: string, excludeId?: string): Promise<boolean>;

  abstract availableEmail(email: string, excludeId?: string): Promise<boolean>;

  abstract availablePhone(phone: string, excludeId?: string): Promise<boolean>;
}
