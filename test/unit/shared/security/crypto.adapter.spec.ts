import { CryptoAdapter } from 'src/shared/security/adapters/crypto.adapter';

describe('CryptoAdapter', () => {
  let crypto: CryptoAdapter;

  beforeEach(() => {
    crypto = new CryptoAdapter();
  });

  describe('generateUuidV4', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = crypto.generateUuidV4();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const a = crypto.generateUuidV4();
      const b = crypto.generateUuidV4();
      expect(a).not.toBe(b);
    });
  });

  describe('validateIsUuidV4', () => {
    it('should return true for valid UUID v4', () => {
      expect(crypto.validateIsUuidV4('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(crypto.validateIsUuidV4('not-a-uuid')).toBe(false);
    });
  });

  describe('token - NUMBER kind', () => {
    it('should generate a 6-digit numeric token by default', () => {
      const token = crypto.token({ kind: 'NUMBER' });
      expect(token).toMatch(/^\d{6}$/);
    });

    it('should generate a token with custom length', () => {
      const token = crypto.token({ kind: 'NUMBER', length: 4 });
      expect(token).toMatch(/^\d{4}$/);
    });

    it('should use default length 6 when length is 0 (falsy)', () => {
      const token = crypto.token({ kind: 'NUMBER', length: 0 });
      expect(token).toMatch(/^\d{6}$/);
    });

    it('should throw for length > 16', () => {
      expect(() => crypto.token({ kind: 'NUMBER', length: 17 })).toThrow();
    });
  });

  describe('token - ALPHANUMERIC kind', () => {
    it('should generate a 64-char hex token by default (32 bytes)', () => {
      const token = crypto.token({ kind: 'ALPHANUMERIC' });
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should generate 32-char hex with 16 bytes', () => {
      const token = crypto.token({ kind: 'ALPHANUMERIC', bytes: 16 });
      expect(token).toMatch(/^[0-9a-f]{32}$/);
    });
  });

  describe('hash', () => {
    it('should produce consistent SHA-256 digest', () => {
      expect(crypto.hash('test')).toBe(crypto.hash('test'));
    });

    it('should produce different hashes for different inputs', () => {
      expect(crypto.hash('abc')).not.toBe(crypto.hash('def'));
    });

    it('should return a 64-char hex string', () => {
      expect(crypto.hash('any')).toMatch(/^[0-9a-f]{64}$/);
    });
  });
});
