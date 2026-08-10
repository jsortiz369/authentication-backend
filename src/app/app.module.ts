import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EnvModule } from '../shared/env/env.module';
import { LoggerModule } from '../shared/logger/logger.module';
import { HttpExceptionFilter } from './exception-filter/http-exception.filter';
import { LoggerRepository } from 'src/shared/logger/ports/logger.repository';
import { DatabaseModule } from 'src/shared/database/database.module';
import { IntegrationModule } from 'src/shared/integrations/integration.module';
import { ContextModule } from 'src/contexts/context.module';
import * as interceptors from './interceptors';

@Module({
  imports: [EventEmitterModule.forRoot(), EnvModule, LoggerModule, DatabaseModule, IntegrationModule, ContextModule],
  providers: [
    {
      provide: HttpExceptionFilter,
      useFactory: (logger: LoggerRepository) => new HttpExceptionFilter(logger),
      inject: [LoggerRepository],
    },
    {
      provide: interceptors.ResponseTimeInterceptor,
      useFactory: (logger: LoggerRepository) => new interceptors.ResponseTimeInterceptor(logger),
      inject: [LoggerRepository],
    },
    {
      provide: interceptors.RequestAgentInterceptor,
      useFactory: () => new interceptors.RequestAgentInterceptor(),
      inject: [],
    },
  ],
})
export class AppModule {}
