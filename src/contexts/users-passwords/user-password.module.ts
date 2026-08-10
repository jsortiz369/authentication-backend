import { Module } from '@nestjs/common';

import { SecurityModule } from 'src/shared/security/security.module';
import { UserPasswordCommandPostgres } from './infrastructure/persistences/postgres/user-password-command.postgres';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';
import { UserPasswordCommandRepository, UserPasswordQueryRepository } from './domain/ports';
import { UserPasswordQueryPostgres } from './infrastructure/persistences/postgres/user-password-query.postgres';
import { PasswordRepository } from 'src/shared/security/ports/password.repository';
import * as handlers from './application';
import * as services from './domain/services';

@Module({
  imports: [SecurityModule],
  controllers: [],
  providers: [
    {
      provide: UserPasswordQueryRepository,
      useFactory: (prisma: PrismaPostgresAdapter) => new UserPasswordQueryPostgres(prisma),
      inject: [PrismaPostgresAdapter],
    },
    {
      provide: UserPasswordCommandRepository,
      useFactory: (prisma: PrismaPostgresAdapter) => new UserPasswordCommandPostgres(prisma),
      inject: [PrismaPostgresAdapter],
    },
    {
      provide: services.UserPasswordByIdUserService,
      useFactory: (userPasswordQuery: UserPasswordQueryRepository) => new services.UserPasswordByIdUserService(userPasswordQuery),
      inject: [UserPasswordQueryRepository],
    },
    {
      provide: handlers.UserPasswordCreateHandler,
      useFactory: (
        crypto: CryptoRepository,
        password: PasswordRepository,
        userPasswordQuery: UserPasswordQueryRepository,
        userPasswordCommand: UserPasswordCommandRepository,
      ) => new handlers.UserPasswordCreateHandler(crypto, password, userPasswordQuery, userPasswordCommand),
      inject: [CryptoRepository, PasswordRepository, UserPasswordQueryRepository, UserPasswordCommandRepository],
    },
  ],
  exports: [services.UserPasswordByIdUserService, handlers.UserPasswordCreateHandler],
})
export class UserPasswordModule {}
