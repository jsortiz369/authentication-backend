import { Auth } from 'src/contexts/auth/domain/entities/auth.entity';
import { AuthCommandRepository } from 'src/contexts/auth/domain/ports/auth-command.repository';
import { AuthId } from 'src/contexts/auth/domain/vo';
import { UserId } from 'src/contexts/users/domain/vo';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';

export class AuthCommandPostgres implements AuthCommandRepository {
  constructor(private readonly _prisma$: PrismaPostgresAdapter) {}

  async createSession(auth: Auth): Promise<Auth> {
    await this._prisma$.userSession.create({
      data: {
        id: auth._id._value,
        userId: auth._idUser._value,
        refreshTokenHash: auth.refreshTokenHash,
        ip: auth.ip,
        browser: auth.browser,
        browserVersion: auth.browserVersion,
        operatingSystem: auth.operatingSystem,
        device: auth.device,
        expiresAt: auth.expiresAt,
        revokedAt: auth.revokedAt,
        createdAt: auth.createdAt,
        updatedAt: auth.updatedAt,
      },
    });

    return auth;
  }

  async updateSession(id: AuthId, userId: UserId, tokenHash: string, expiresAt: Date): Promise<void> {
    await this._prisma$.userSession.update({
      data: {
        refreshTokenHash: tokenHash,
        expiresAt,
        revokedAt: expiresAt,
      },
      where: {
        id: id._value,
        userId: userId._value,
      },
    });

    return;
  }

  async revokeSession(id: AuthId, userId: UserId): Promise<void> {
    await this._prisma$.userSession.update({
      data: {
        revokedAt: new Date(),
      },
      where: {
        id: id._value,
        userId: userId._value,
      },
    });
  }
}
