import { UserPasswordQueryRepository } from 'src/contexts/users-passwords/domain/ports';
import { UserPasswordCurrentProjection, UserPasswordFindAllByIdUserProjection } from 'src/contexts/users-passwords/domain/projections';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';

export class UserPasswordQueryPostgres implements UserPasswordQueryRepository {
  constructor(private readonly _prisma$: PrismaPostgresAdapter) {}

  async findCurrentByIdUser(idUser: string): Promise<UserPasswordCurrentProjection | null> {
    const result = await this._prisma$.userPassword.findFirst({
      where: { userId: idUser, isCurrent: true },
      select: { password: true, createdAt: true },
    });

    if (!result) return null;
    return new UserPasswordCurrentProjection(result.password, result.createdAt);
  }

  async findAllByIdUser(idUser: string, limit: number): Promise<UserPasswordFindAllByIdUserProjection[]> {
    const result = await this._prisma$.userPassword.findMany({
      where: { userId: idUser },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, password: true, createdAt: true, isCurrent: true, userId: true },
    });

    return result.map((item) => new UserPasswordFindAllByIdUserProjection(item.id, item.userId, item.password, item.isCurrent, item.createdAt));
  }
}
