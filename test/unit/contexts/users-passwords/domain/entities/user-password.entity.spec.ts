import { UserPassword } from 'src/contexts/users-passwords/domain/entities/user-password.entity';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_USER_UUID = '660e8400-e29b-41d4-a716-446655440000';

describe('UserPassword Entity', () => {
  describe('create()', () => {
    it('should create a UserPassword entity', () => {
      const entity = UserPassword.create({
        _id: VALID_UUID,
        userId: VALID_USER_UUID,
        password: '$2b$12$hashedpassword',
      });

      const prim = entity.toValuesPrimitives();
      expect(prim._id).toBe(VALID_UUID);
      expect(prim.userId).toBe(VALID_USER_UUID);
      expect(prim.password).toBe('$2b$12$hashedpassword');
    });

    it('should set isCurrent to true by default', () => {
      const entity = UserPassword.create({
        _id: VALID_UUID,
        userId: VALID_USER_UUID,
        password: 'hashed',
      });
      expect(entity.toValuesPrimitives().isCurrent).toBe(true);
    });

    it('should set createdAt to current date', () => {
      const before = new Date();
      const entity = UserPassword.create({
        _id: VALID_UUID,
        userId: VALID_USER_UUID,
        password: 'hashed',
      });
      const after = new Date();
      expect(entity.createdAtValue.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(entity.createdAtValue.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('getters', () => {
    it('should expose id, userId, password, isCurrent, createdAt', () => {
      const entity = UserPassword.create({
        _id: VALID_UUID,
        userId: VALID_USER_UUID,
        password: 'hashed',
      });
      expect(entity._id._value).toBe(VALID_UUID);
      expect(entity._idUser._value).toBe(VALID_USER_UUID);
      expect(entity.password.value).toBe('hashed');
      expect(entity.isCurrentValue).toBe(true);
      expect(entity.createdAtValue).toBeInstanceOf(Date);
    });
  });
});
