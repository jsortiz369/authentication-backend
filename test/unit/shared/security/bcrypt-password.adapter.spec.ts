import { BcryptPasswordAdapter } from 'src/shared/security/adapters/bcrypt-password.adapter';

describe('BcryptPasswordAdapter', () => {
  let adapter: BcryptPasswordAdapter;

  beforeAll(() => {
    adapter = new BcryptPasswordAdapter();
  });

  describe('hash', () => {
    it('should return a bcrypt hash string', async () => {
      const hash = await adapter.hash('MyPassword123!');
      expect(hash).toMatch(/^\$2[aby]?\$\d{1,2}\$.{53}$/);
    });

    it('should produce different hashes for the same password across different instances', async () => {
      const adapter2 = new BcryptPasswordAdapter();
      const hash1 = await adapter.hash('SamePass!');
      const hash2 = await adapter2.hash('SamePass!');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = 'Test.1234';
      const hash = await adapter.hash(password);
      const result = await adapter.compare(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await adapter.hash('CorrectPass.1');
      const result = await adapter.compare('WrongPass.1', hash);
      expect(result).toBe(false);
    });
  });
});
