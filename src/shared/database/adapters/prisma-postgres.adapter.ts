import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { EnvRepository } from 'src/shared/env/ports/env.repository';
import { LoggerRepository } from 'src/shared/logger/ports/logger.repository';

export class PrismaPostgresAdapter extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly _logger$: LoggerRepository,
    env: EnvRepository,
  ) {
    const adapter = new PrismaPg({ connectionString: env.baseUrl });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();

      this._logger$.log('👀 Server prisma database connected POSTGRESQL', 'Database');
    } catch (error) {
      this._logger$.error('Error connecting to postgres', 'DatabaseApplication');
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
