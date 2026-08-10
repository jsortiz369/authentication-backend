import { Module } from '@nestjs/common';

import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { SecurityModule } from 'src/shared/security/security.module';
import { UserQueryRepository } from './domain/ports/user-query.repository';
import { UserQueryPostgres } from './infrastructure/persistences/postgres/user-query.postgres';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';
import { UserCommandRepository } from './domain/ports/user-command.repository';
import { UserCommandPostgres } from './infrastructure/persistences/postgres/user-command.postgres';
import { UserPasswordModule } from '../users-passwords/user-password.module';
import { UserPasswordCreateHandler } from '../users-passwords/application';
import * as handlers from './application';
import * as services from './domain/services';

@Module({
  imports: [SecurityModule, UserPasswordModule],
  controllers: [],
  providers: [
    {
      provide: UserQueryRepository,
      useFactory: (prisma: PrismaPostgresAdapter) => new UserQueryPostgres(prisma),
      inject: [PrismaPostgresAdapter],
    },
    {
      provide: UserCommandRepository,
      useFactory: (prisma: PrismaPostgresAdapter) => new UserCommandPostgres(prisma),
      inject: [PrismaPostgresAdapter],
    },
    {
      provide: services.UserSingInService,
      useFactory: (query: UserQueryRepository) => new services.UserSingInService(query),
      inject: [UserQueryRepository],
    },
    {
      provide: services.UserUpdateFailedAttemptsSingInServices,
      useFactory: (command: UserCommandRepository) => new services.UserUpdateFailedAttemptsSingInServices(command),
      inject: [UserCommandRepository],
    },
    {
      provide: services.UserFindOneByIdService,
      useFactory: (query: UserQueryRepository) => new services.UserFindOneByIdService(query),
      inject: [UserQueryRepository],
    },
    {
      provide: services.UserUpdateConfirmService,
      useFactory: (command: UserCommandRepository) => new services.UserUpdateConfirmService(command),
      inject: [UserCommandRepository],
    },
    {
      provide: handlers.UserCreateHandler,
      useFactory: (
        crypto: CryptoRepository,
        userQuery: UserQueryRepository,
        userCommand: UserCommandRepository,
        userPasswordCreate: UserPasswordCreateHandler,
      ) => new handlers.UserCreateHandler(crypto, userQuery, userCommand, userPasswordCreate),
      inject: [CryptoRepository, UserQueryRepository, UserCommandRepository, UserPasswordCreateHandler],
    },
    {
      provide: handlers.UserCheckEmailHandler,
      useFactory: (userQuery: UserQueryRepository) => new handlers.UserCheckEmailHandler(userQuery),
      inject: [UserQueryRepository],
    },
    {
      provide: handlers.UserCheckPhoneHandler,
      useFactory: (userQuery: UserQueryRepository) => new handlers.UserCheckPhoneHandler(userQuery),
      inject: [UserQueryRepository],
    },
    {
      provide: handlers.UserCheckUsernameHandler,
      useFactory: (userQuery: UserQueryRepository) => new handlers.UserCheckUsernameHandler(userQuery),
      inject: [UserQueryRepository],
    },
  ],
  exports: [
    services.UserSingInService,
    services.UserUpdateFailedAttemptsSingInServices,
    services.UserFindOneByIdService,
    services.UserUpdateConfirmService,
    handlers.UserCreateHandler,
    handlers.UserCheckEmailHandler,
    handlers.UserCheckPhoneHandler,
    handlers.UserCheckUsernameHandler,
  ],
})
export class UserModule {}
