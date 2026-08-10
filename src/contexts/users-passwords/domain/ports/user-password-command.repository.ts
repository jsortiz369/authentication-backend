import { UserPassword } from '../entities/user-password.entity';

export abstract class UserPasswordCommandRepository {
  abstract create(data: UserPassword): Promise<UserPassword>;
}
