import { Prisma } from 'generated/prisma/client';
import { UserQueryRepository } from 'src/contexts/users/domain/ports/user-query.repository';
import { UserFindOneByIdProjection } from 'src/contexts/users/domain/projections/user-find-one-by-id.projection';
import { UserSingInProjection } from 'src/contexts/users/domain/projections/user-sing-in.projection';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';

export class UserQueryPostgres implements UserQueryRepository {
  constructor(private readonly _prisma$: PrismaPostgresAdapter) {}

  async findOneById(id: string): Promise<UserFindOneByIdProjection | null> {
    const result = await this._prisma$.user.findFirst({
      where: { id, deletedAt: null },
      omit: { deletedAt: true },
    });

    if (!result) return null;

    return new UserFindOneByIdProjection(
      result.id,
      result.names,
      result.surnames,
      result.username,
      result.phone,
      result.email,
      result.confirmed,
      result.status,
      result.createdAt,
      result.updatedAt,
    );
  }

  async findOneForSingIn(usernameOrEmail: string): Promise<UserSingInProjection | null> {
    const where: Prisma.UserWhereInput = { deletedAt: null };
    if (usernameOrEmail.includes('@')) where.email = usernameOrEmail;
    else where.username = usernameOrEmail;

    const result = await this._prisma$.user.findFirst({
      where,
      select: {
        id: true,
        names: true,
        surnames: true,
        username: true,
        email: true,
        confirmed: true,
        status: true,
        failedAttempts: true,
        lockUntil: true,
      },
    });
    if (!result) return null;

    return new UserSingInProjection(
      result.id,
      result.names,
      result.surnames,
      result.username,
      result.email,
      result.confirmed,
      result.status,
      result.failedAttempts,
      result.lockUntil,
    );
  }

  async availableUsername(username: string, excludeId?: string): Promise<boolean> {
    const result = await this._prisma$.user.findFirst({
      where: { username, id: { not: excludeId }, deletedAt: null },
      select: { id: true },
    });

    return result === null ? true : false;
  }

  async availableEmail(email: string, excludeId?: string): Promise<boolean> {
    const result = await this._prisma$.user.findFirst({
      where: { email, id: { not: excludeId }, deletedAt: null },
      select: { id: true },
    });

    return result === null ? true : false;
  }

  async availablePhone(phone: string, excludeId?: string): Promise<boolean> {
    const result = await this._prisma$.user.findFirst({
      where: { phone, id: { not: excludeId }, deletedAt: null },
      select: { id: true },
    });

    return result === null ? true : false;
  }
}
