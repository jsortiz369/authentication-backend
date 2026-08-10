import { Global, Module } from '@nestjs/common';

import { LoggerRepository } from './ports/logger.repository';
import { LoggerAdapter } from './adapters/logger.adapter';
import { EnvRepository } from '../env/ports/env.repository';

@Global()
@Module({
  providers: [
    {
      provide: LoggerRepository,
      useFactory: (env: EnvRepository) => new LoggerAdapter(env),
      inject: [EnvRepository],
    },
  ],
  exports: [LoggerRepository],
})
export class LoggerModule {}
