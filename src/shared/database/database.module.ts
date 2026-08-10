import { Global, Module } from '@nestjs/common';

import { PrismaPostgresAdapter } from './adapters/prisma-postgres.adapter';
import { LoggerRepository } from '../logger/ports/logger.repository';
import { EnvRepository } from '../env/ports/env.repository';

@Global()
@Module({
  providers: [
    {
      provide: PrismaPostgresAdapter,
      useFactory: (logger: LoggerRepository, env: EnvRepository) => new PrismaPostgresAdapter(logger, env),
      inject: [LoggerRepository, EnvRepository],
    },
  ],
  exports: [PrismaPostgresAdapter],
})
export class DatabaseModule {}
