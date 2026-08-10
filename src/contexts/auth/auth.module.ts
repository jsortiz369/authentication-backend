import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { SecurityModule } from 'src/shared/security/security.module';
import { UserModule } from '../users/user.module';
import { IntegrationModule } from 'src/shared/integrations/integration.module';
import { UserPasswordModule } from '../users-passwords/user-password.module';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { CacheRepository } from 'src/shared/integrations/ports/cache.repository';
import { JwtRepository } from 'src/shared/security/ports/jwt.repository';
import { AuthSingUpEvent } from './infrastructure/events/auth-sing-up.event';
import { QUEUE } from 'src/app/constants/queue.constant';
import { AuthRecoverPasswordWorker, AuthSingUpWorker } from './infrastructure/workers';
import { MailRepository } from 'src/shared/integrations/ports/mail.repository';
import { UserPasswordByIdUserService } from '../users-passwords/domain/services';
import { PasswordRepository } from 'src/shared/security/ports/password.repository';
import { AuthTokenAccessService, AuthTokenConfirmAccountService } from './application/services';
import { AuthCommandPostgres } from './infrastructure/persistences/postgres/auth-command.postgres';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';
import { AuthCommandRepository } from './domain/ports/auth-command.repository';
import { AuthQueryRepository } from './domain/ports/auth-query.repository';
import { AuthQueryPostgres } from './infrastructure/persistences/postgres/auth-query.postgres';
import { AuthRevokeSessionService } from './application/services/auth-revoke-session.service';
import { AuthRecoverPasswordEvent } from './infrastructure/events';
import { EnvRepository } from 'src/shared/env/ports/env.repository';
import { UserPasswordCreateHandler } from '../users-passwords/application';
import * as servicesUser from '../users/domain/services';
import * as handlersUser from '../users/application';
import * as controllers from './infrastructure/http/controllers';
import * as handlers from './application';

@Module({
  imports: [
    SecurityModule,
    IntegrationModule,
    UserModule,
    UserPasswordModule,
    BullModule.registerQueue({ name: QUEUE.emails.confirm_account }, { name: QUEUE.emails.recover_password }),
  ],
  controllers: [
    controllers.AuthSingInController,
    controllers.AuthSingUpController,
    controllers.AuthSingUpCheckEmailController,
    controllers.AuthSingUpCheckPhoneController,
    controllers.AuthSingUpCheckUsernameController,
    controllers.AuthSingUpConfirmController,
    controllers.AuthSingUpResendTokenConfirmController,
    controllers.AuthRecoverPasswordController,
    controllers.AuthResetPasswordController,
    controllers.AuthResetPasswordVerifyTokenController,
    controllers.AuthMeController,
    controllers.AuthLogoutController,
    controllers.AuthRefreshTokenController,
  ],
  providers: [
    {
      provide: AuthCommandRepository,
      useFactory: (prisma: PrismaPostgresAdapter) => new AuthCommandPostgres(prisma),
      inject: [PrismaPostgresAdapter],
    },
    {
      provide: AuthQueryRepository,
      useFactory: (prisma: PrismaPostgresAdapter) => new AuthQueryPostgres(prisma),
      inject: [PrismaPostgresAdapter],
    },
    {
      provide: AuthSingUpEvent,
      useClass: AuthSingUpEvent,
    },
    {
      provide: AuthRecoverPasswordEvent,
      useClass: AuthRecoverPasswordEvent,
    },
    {
      provide: AuthSingUpWorker,
      useFactory: (mail: MailRepository) => new AuthSingUpWorker(mail),
      inject: [MailRepository],
    },
    {
      provide: AuthRecoverPasswordWorker,
      useFactory: (env: EnvRepository, mail: MailRepository) => new AuthRecoverPasswordWorker(env, mail),
      inject: [EnvRepository, MailRepository],
    },
    {
      provide: AuthRevokeSessionService,
      useFactory: (commandRepository: AuthCommandRepository, cache: CacheRepository) => new AuthRevokeSessionService(commandRepository, cache),
      inject: [AuthCommandRepository, CacheRepository],
    },
    {
      provide: AuthTokenConfirmAccountService,
      useFactory: (crypto: CryptoRepository, cache: CacheRepository, singUpEvent: AuthSingUpEvent, jwt: JwtRepository) =>
        new AuthTokenConfirmAccountService(crypto, cache, singUpEvent, jwt),
      inject: [CryptoRepository, CacheRepository, AuthSingUpEvent, JwtRepository],
    },
    {
      provide: AuthTokenAccessService,
      useFactory: (
        crypto: CryptoRepository,
        jwt: JwtRepository,
        cache: CacheRepository,
        commandRepository: AuthCommandRepository,
        authRevokeSession: AuthRevokeSessionService,
      ) => new AuthTokenAccessService(crypto, jwt, cache, commandRepository, authRevokeSession),
      inject: [CryptoRepository, JwtRepository, CacheRepository, AuthCommandRepository, AuthRevokeSessionService],
    },
    {
      provide: handlers.AuthSingUpHandler,
      useFactory: (userCreateHandler: handlersUser.UserCreateHandler, authConfirmAccountService: AuthTokenConfirmAccountService) =>
        new handlers.AuthSingUpHandler(userCreateHandler, authConfirmAccountService),
      inject: [handlersUser.UserCreateHandler, AuthTokenConfirmAccountService],
    },
    {
      provide: handlers.AuthSingUpCheckEmailHandler,
      useFactory: (checkEmail: handlersUser.UserCheckEmailHandler) => new handlers.AuthSingUpCheckEmailHandler(checkEmail),
      inject: [handlersUser.UserCheckEmailHandler],
    },
    {
      provide: handlers.AuthSingUpCheckPhoneHandler,
      useFactory: (checkPhone: handlersUser.UserCheckPhoneHandler) => new handlers.AuthSingUpCheckPhoneHandler(checkPhone),
      inject: [handlersUser.UserCheckPhoneHandler],
    },
    {
      provide: handlers.AuthSingUpCheckUsernameHandler,
      useFactory: (checkUsername: handlersUser.UserCheckUsernameHandler) => new handlers.AuthSingUpCheckUsernameHandler(checkUsername),
      inject: [handlersUser.UserCheckUsernameHandler],
    },
    {
      provide: handlers.AuthSingUpConfirmHandler,
      useFactory: (
        userFindOneById: servicesUser.UserFindOneByIdService,
        crypto: CryptoRepository,
        cache: CacheRepository,
        userUpdateConfirm: servicesUser.UserUpdateConfirmService,
        tokenAccessService: AuthTokenAccessService,
      ) => new handlers.AuthSingUpConfirmHandler(userFindOneById, crypto, cache, userUpdateConfirm, tokenAccessService),
      inject: [servicesUser.UserFindOneByIdService, CryptoRepository, CacheRepository, servicesUser.UserUpdateConfirmService, AuthTokenAccessService],
    },
    {
      provide: handlers.AuthSingUpResendTokenConfirmHandler,
      useFactory: (userFindOneById: servicesUser.UserFindOneByIdService, authConfirmAccountService: AuthTokenConfirmAccountService) =>
        new handlers.AuthSingUpResendTokenConfirmHandler(userFindOneById, authConfirmAccountService),
      inject: [servicesUser.UserFindOneByIdService, AuthTokenConfirmAccountService],
    },
    {
      provide: handlers.AuthSingInHandler,
      useFactory: (
        userForSingIn: servicesUser.UserSingInService,
        userPassword: UserPasswordByIdUserService,
        passwordRepository: PasswordRepository,
        userUpdateFailedAttempts: servicesUser.UserUpdateFailedAttemptsSingInServices,
        authConfirmAccountService: AuthTokenConfirmAccountService,
        tokenAccessService: AuthTokenAccessService,
      ) =>
        new handlers.AuthSingInHandler(
          userForSingIn,
          userPassword,
          passwordRepository,
          userUpdateFailedAttempts,
          authConfirmAccountService,
          tokenAccessService,
        ),
      inject: [
        servicesUser.UserSingInService,
        UserPasswordByIdUserService,
        PasswordRepository,
        servicesUser.UserUpdateFailedAttemptsSingInServices,
        AuthTokenConfirmAccountService,
        AuthTokenAccessService,
      ],
    },
    {
      provide: handlers.AuthRecoverPasswordHandler,
      useFactory: (
        userForSingIn: servicesUser.UserSingInService,
        crypto: CryptoRepository,
        cache: CacheRepository,
        recoverPasswordEvent: AuthRecoverPasswordEvent,
      ) => new handlers.AuthRecoverPasswordHandler(userForSingIn, crypto, cache, recoverPasswordEvent),
      inject: [servicesUser.UserSingInService, CryptoRepository, CacheRepository, AuthRecoverPasswordEvent],
    },
    {
      provide: handlers.AuthResetPasswordHandler,
      useFactory: (
        crypto: CryptoRepository,
        cache: CacheRepository,
        userFindOneById: servicesUser.UserFindOneByIdService,
        passwordCreateHandler: UserPasswordCreateHandler,
      ) => new handlers.AuthResetPasswordHandler(crypto, cache, userFindOneById, passwordCreateHandler),
      inject: [CryptoRepository, CacheRepository, servicesUser.UserFindOneByIdService, UserPasswordCreateHandler],
    },
    {
      provide: handlers.AuthResetPasswordVerifyTokenHandler,
      useFactory: (crypto: CryptoRepository, cache: CacheRepository) => new handlers.AuthResetPasswordVerifyTokenHandler(crypto, cache),
      inject: [CryptoRepository, CacheRepository],
    },
    {
      provide: handlers.AuthMeHandler,
      useFactory: (userFindOneById: servicesUser.UserFindOneByIdService) => new handlers.AuthMeHandler(userFindOneById),
      inject: [servicesUser.UserFindOneByIdService],
    },
    {
      provide: handlers.AuthLogoutHandler,
      useFactory: (userFindOneById: servicesUser.UserFindOneByIdService, authRevokeSession: AuthRevokeSessionService) =>
        new handlers.AuthLogoutHandler(userFindOneById, authRevokeSession),
      inject: [servicesUser.UserFindOneByIdService, AuthRevokeSessionService],
    },
    {
      provide: handlers.AuthRefreshTokenHandler,
      useFactory: (
        userFindOneById: servicesUser.UserFindOneByIdService,
        crypto: CryptoRepository,
        jwt: JwtRepository,
        cache: CacheRepository,
        commandRepository: AuthCommandRepository,
      ) => new handlers.AuthRefreshTokenHandler(userFindOneById, crypto, jwt, cache, commandRepository),
      inject: [servicesUser.UserFindOneByIdService, CryptoRepository, JwtRepository, CacheRepository, AuthCommandRepository],
    },
  ],
})
export class AuthModule {}
