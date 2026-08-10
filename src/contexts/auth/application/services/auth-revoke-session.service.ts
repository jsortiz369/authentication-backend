import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { AuthCommandRepository } from '../../domain/ports/auth-command.repository';
import { AuthId } from '../../domain/vo';
import { UserId } from 'src/contexts/users/domain/vo';

export class AuthRevokeSessionService {
  constructor(
    private readonly _authCommandRepository$: AuthCommandRepository,
    private readonly _cacheRepository$: CacheRepository,
  ) {}

  async execute(idSession: string, idUser: string): Promise<void> {
    // TODO: invalid session
    await this._authCommandRepository$.revokeSession(new AuthId(idSession), new UserId(idUser));

    // TODO: invalid session redis
    await this._cacheRepository$.delete(`session:${idSession}:user:${idUser}`);
  }
}
