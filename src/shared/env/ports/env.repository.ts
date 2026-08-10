import { Env } from './env.interface';

export abstract class EnvRepository {
  baseUrl: string;

  abstract env<T extends keyof Env>(key: T): Env[T];

  abstract envSystem(key: string): string | undefined;
}
