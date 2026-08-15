import { AuthQueryRepository, AuthSessionProjection } from 'src/contexts/auth/domain/ports/auth-query.repository';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';

export class AuthQueryPostgres implements AuthQueryRepository {
  constructor(private readonly _prisma$: PrismaPostgresAdapter) {}

  async findActiveSessionsByUserId(userId: string): Promise<AuthSessionProjection[]> {
    const sessions = await this._prisma$.userSession.findMany({
      where: {
        userId,
        revokedAt: { gt: new Date() },
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        ip: true,
        browser: true,
        browserVersion: true,
        operatingSystem: true,
        device: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => ({
      _id: s.id,
      ip: s.ip,
      browser: s.browser,
      browserVersion: s.browserVersion,
      operatingSystem: s.operatingSystem,
      device: s.device,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
    }));
  }
}
