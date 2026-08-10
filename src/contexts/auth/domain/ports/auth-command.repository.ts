import { UserId } from 'src/contexts/users/domain/vo';
import { Auth } from '../entities/auth.entity';
import { AuthId } from '../vo';

export abstract class AuthCommandRepository {
  abstract createSession(data: Auth): Promise<Auth>;

  abstract updateSession(id: AuthId, userId: UserId, tokenHash: string, expiresAt: Date): Promise<void>;

  abstract revokeSession(id: AuthId, userId: UserId): Promise<void>;
}
