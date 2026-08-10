import { Global, Module } from '@nestjs/common';

import { EnvRepository } from './ports/env.repository';
import { EnvZodAdapter } from './adapters/env-zod.adapter';

@Global()
@Module({
  providers: [
    {
      provide: EnvRepository,
      useClass: EnvZodAdapter,
    },
  ],
  exports: [EnvRepository],
})
export class EnvModule {}
