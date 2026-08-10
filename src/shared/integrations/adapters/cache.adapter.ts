import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import { CacheRepository } from '../ports/cache.repository';

export class CacheAdapter implements CacheRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly _cache$: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this._cache$.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this._cache$.set(key, value, ttl);
    return;
  }

  async delete(key: string): Promise<void> {
    await this._cache$.del(key);
    return;
  }
}
