import { CacheAdapter } from 'src/shared/integrations/adapters/cache.adapter';

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  stores: [],
};

describe('CacheAdapter', () => {
  let adapter: CacheAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new CacheAdapter(mockCacheManager as any);
  });

  describe('get', () => {
    it('should call cache.get with the key', async () => {
      mockCacheManager.get.mockResolvedValue('cached-value');
      const result = await adapter.get('my-key');
      expect(result).toBe('cached-value');
      expect(mockCacheManager.get).toHaveBeenCalledWith('my-key');
    });

    it('should return undefined when key does not exist', async () => {
      mockCacheManager.get.mockResolvedValue(undefined);
      const result = await adapter.get('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should call cache.set with key, value and ttl', async () => {
      await adapter.set('key', 'value', 3000);
      expect(mockCacheManager.set).toHaveBeenCalledWith('key', 'value', 3000);
    });

    it('should call cache.set without ttl when not provided', async () => {
      await adapter.set('key', 'value');
      expect(mockCacheManager.set).toHaveBeenCalledWith('key', 'value', undefined);
    });
  });

  describe('delete', () => {
    it('should call cache.del with the key', async () => {
      await adapter.delete('key-to-delete');
      expect(mockCacheManager.del).toHaveBeenCalledWith('key-to-delete');
    });
  });
});
