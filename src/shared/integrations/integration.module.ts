import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import KeyvRedis from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';

import { EnvRepository } from '../env/ports/env.repository';
import { CacheRepository } from './ports/cache.repository';
import { CacheAdapter } from './adapters/cache.adapter';
import { MailRepository } from './ports/mail.repository';
import { MailNodemailer } from './adapters/mail-nodemailer.adapter';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (env: EnvRepository) => {
        let redisUrl: string | null = null;
        const password = env.env('REDIS_PASSWORD');
        if (password) redisUrl = `redis://:${password}@${env.env('REDIS_HOST')}:${env.env('REDIS_PORT')}/0`;
        else redisUrl = `redis://${env.env('REDIS_HOST')}:${env.env('REDIS_PORT')}/0`;

        if (!redisUrl) throw new Error('REDIS_URL is not defined');

        return { stores: [new KeyvRedis(redisUrl)] };
      },
      inject: [EnvRepository],
    }),
    BullModule.forRootAsync({
      useFactory: (env: EnvRepository) => ({
        connection: {
          host: env.env('REDIS_HOST'),
          port: env.env('REDIS_PORT'),
          password: env.env('REDIS_PASSWORD'),
          db: 1,
        },
      }),
      inject: [EnvRepository],
    }),
  ],
  providers: [
    {
      provide: CacheRepository,
      useClass: CacheAdapter,
    },
    {
      provide: MailRepository,
      useFactory: (env: EnvRepository) => new MailNodemailer(env),
      inject: [EnvRepository],
    },
  ],
  exports: [CacheRepository, MailRepository],
})
export class IntegrationModule {}
