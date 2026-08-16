import { AuthQueryRepository } from 'src/contexts/auth/domain/ports/auth-query.repository';
import { type AuthSessionProjection } from 'src/contexts/auth/domain/ports/auth-query.repository';
import { AuthSessionsQuery } from './auth-sessions.query';

export interface SessionResponse extends AuthSessionProjection {
  isCurrent: boolean;
}

export class AuthSessionsHandler {
  constructor(private readonly _authQueryRepository$: AuthQueryRepository) {}

  async execute(query: AuthSessionsQuery): Promise<SessionResponse[]> {
    const sessions: AuthSessionProjection[] = await this._authQueryRepository$.findActiveSessionsByUserId(query.idUser);

    return sessions.map((session) => ({
      ...session,
      isCurrent: session._id === query.currentSessionId,
    }));
  }
}
