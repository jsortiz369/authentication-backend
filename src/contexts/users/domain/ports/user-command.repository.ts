import { User } from '../entities/user.entity';
import { UserId } from '../vo';

export abstract class UserCommandRepository {
  abstract create(data: User): Promise<User>;

  abstract update(data: User): Promise<User>;

  abstract updateLoginAttempts(_id: UserId, attempts: number): Promise<void>;

  abstract updateConfirmed(_id: UserId): Promise<void>;

  abstract delete(userId: UserId): Promise<void>;
}
