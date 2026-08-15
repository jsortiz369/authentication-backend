import { Auth } from 'src/contexts/auth/domain/entities/auth.entity';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_USER_UUID = '660e8400-e29b-41d4-a716-446655440000';

const BASE_PRIMITIVE = {
  _id: VALID_UUID,
  userId: VALID_USER_UUID,
  refreshTokenHash: 'hashed-token',
  ip: '192.168.1.1',
  browser: 'Chrome',
  browserVersion: '120.0',
  operatingSystem: 'Windows',
  device: 'Desktop',
  expiresAt: new Date('2026-08-21T00:00:00Z'),
  revokedAt: new Date('2026-08-21T00:00:00Z'),
};

describe('Auth Entity', () => {
  describe('create()', () => {
    it('should create an Auth entity with correct primitives', () => {
      const auth = Auth.create(BASE_PRIMITIVE);
      const prim = auth.toValuesPrimitives();

      expect(prim._id).toBe(VALID_UUID);
      expect(prim.userId).toBe(VALID_USER_UUID);
      expect(prim.refreshTokenHash).toBe('hashed-token');
      expect(prim.ip).toBe('192.168.1.1');
      expect(prim.browser).toBe('Chrome');
      expect(prim.browserVersion).toBe('120.0');
      expect(prim.operatingSystem).toBe('Windows');
      expect(prim.device).toBe('Desktop');
    });

    it('should set createdAt and updatedAt to the same date', () => {
      const auth = Auth.create(BASE_PRIMITIVE);
      const prim = auth.toValuesPrimitives();
      expect(prim.createdAt).toEqual(prim.updatedAt);
    });

    it('should default nullable fields to null when not provided', () => {
      const auth = Auth.create({
        ...BASE_PRIMITIVE,
        ip: undefined,
        browser: undefined,
        browserVersion: undefined,
        operatingSystem: undefined,
        device: undefined,
      });
      const prim = auth.toValuesPrimitives();
      expect(prim.ip).toBeNull();
      expect(prim.browser).toBeNull();
      expect(prim.browserVersion).toBeNull();
      expect(prim.operatingSystem).toBeNull();
      expect(prim.device).toBeNull();
    });
  });

  describe('getters and setters', () => {
    it('should update refreshTokenHash', () => {
      const auth = Auth.create(BASE_PRIMITIVE);
      auth.refreshTokenHash = 'new-hash';
      expect(auth.refreshTokenHash).toBe('new-hash');
    });

    it('should update expiresAt', () => {
      const auth = Auth.create(BASE_PRIMITIVE);
      const newDate = new Date('2027-01-01T00:00:00Z');
      auth.expiresAt = newDate;
      expect(auth.expiresAt).toBe(newDate);
    });

    it('should update revokedAt', () => {
      const auth = Auth.create(BASE_PRIMITIVE);
      const newDate = new Date('2027-01-01T00:00:00Z');
      auth.revokedAt = newDate;
      expect(auth.revokedAt).toBe(newDate);
    });

    it('should update updatedAt', () => {
      const auth = Auth.create(BASE_PRIMITIVE);
      const newDate = new Date('2027-02-01T00:00:00Z');
      auth.updatedAt = newDate;
      expect(auth.updatedAt).toBe(newDate);
    });
  });
});
