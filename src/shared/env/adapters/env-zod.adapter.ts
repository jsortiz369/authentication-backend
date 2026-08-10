import { config } from 'dotenv';
import { ZodSafeParseResult } from 'zod';

import { Env } from '../ports/env.interface';
import { EnvRepository } from '../ports/env.repository';
import { envZodSchema } from './env-zod.schema';

export class EnvZodAdapter implements EnvRepository {
  private readonly _env: Env;

  constructor() {
    const resultEnv = config({ path: `.env` });
    if (resultEnv?.error instanceof Error) throw new Error(`Could not find .env file`);
    const parsedConfig: ZodSafeParseResult<Env> = envZodSchema.safeParse(resultEnv.parsed);
    if (parsedConfig.error && !parsedConfig.data) throw new Error(`${parsedConfig.error._zod.def.map((e) => e.message).join(', ')}`);
    this._env = parsedConfig.data;
  }

  get baseUrl(): string {
    const host = this._env.DB_HOST;
    const port = this._env.DB_PORT;
    const name = this._env.DB_NAME;
    const username = this._env.DB_USERNAME;
    const password = this._env.DB_PASSWORD;
    return `postgres://${username}:${password}@${host}:${port}/${name}`;
  }

  env<T extends keyof Env>(key: T): Env[T] {
    this.validateVariable(key);
    return this._env[key];
  }

  envSystem(key: string): string | undefined {
    this.validateVariable(key);
    return process.env[key];
  }

  private validateVariable<T extends string>(value: T): boolean {
    if (value === null || value === null) throw new Error('Environment variable not found');
    return true;
  }
}
