import { User } from 'src/contexts/users/domain/entities/user.entity';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

const BASE_PRIMITIVE = {
  _id: VALID_UUID,
  names: 'Juan',
  surnames: 'Garcia',
  username: 'jgarcia',
  phone: '3184567852',
  email: 'juan@example.com',
};

describe('User Entity', () => {
  describe('create()', () => {
    it('should create a User with correct primitives', () => {
      const user = User.create(BASE_PRIMITIVE);
      const prim = user.toValuesPrimitives();

      expect(prim._id).toBe(VALID_UUID);
      expect(prim.names).toBe('Juan');
      expect(prim.surnames).toBe('Garcia');
      expect(prim.username).toBe('jgarcia');
      expect(prim.phone).toBe('3184567852');
      expect(prim.email).toBe('juan@example.com');
    });

    it('should set confirmed to false', () => {
      const user = User.create(BASE_PRIMITIVE);
      expect(user.toValuesPrimitives().confirmed).toBe(false);
    });

    it('should set status to true', () => {
      const user = User.create(BASE_PRIMITIVE);
      expect(user.toValuesPrimitives().status).toBe(true);
    });

    it('should set failedAttempts to 0', () => {
      const user = User.create(BASE_PRIMITIVE);
      expect(user.toValuesPrimitives().failedAttempts).toBe(0);
    });

    it('should set lockUntil and deletedAt to null', () => {
      const user = User.create(BASE_PRIMITIVE);
      const prim = user.toValuesPrimitives();
      expect(prim.lockUntil).toBeNull();
      expect(prim.deletedAt).toBeNull();
    });

    it('should set createdAt equal to updatedAt', () => {
      const user = User.create(BASE_PRIMITIVE);
      const prim = user.toValuesPrimitives();
      expect(prim.createdAt).toEqual(prim.updatedAt);
    });
  });

  describe('getters and setters', () => {
    it('should update confirmed', () => {
      const user = User.create(BASE_PRIMITIVE);
      user.confirmed = true;
      expect(user.confirmed).toBe(true);
    });

    it('should update status', () => {
      const user = User.create(BASE_PRIMITIVE);
      user.status = false;
      expect(user.status).toBe(false);
    });

    it('should update failedAttempts', () => {
      const user = User.create(BASE_PRIMITIVE);
      user.failedAttempts = 4;
      expect(user.failedAttempts).toBe(4);
    });

    it('should update lockUntil', () => {
      const user = User.create(BASE_PRIMITIVE);
      const date = new Date();
      user.lockUntil = date;
      expect(user.lockUntil).toBe(date);
    });
  });
});
