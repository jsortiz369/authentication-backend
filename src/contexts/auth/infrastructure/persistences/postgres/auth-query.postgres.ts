import { AuthQueryRepository } from 'src/contexts/auth/domain/ports/auth-query.repository';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';

export class AuthQueryPostgres implements AuthQueryRepository {
  constructor(private readonly _prisma$: PrismaPostgresAdapter) {}
}
