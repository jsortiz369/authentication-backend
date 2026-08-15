import { UuidInvalidException } from 'src/shared/domain/exeptions/uuid-invalid.exception';
import { UserId } from 'src/contexts/users/domain/vo/user-id.vo';

describe('UserId VO', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  it('should accept a valid UUID v4', () => {
    const vo = new UserId(VALID_UUID);
    expect(vo._value).toBe(VALID_UUID);
  });

  it('should throw UuidInvalidException for invalid UUID', () => {
    expect(() => new UserId('not-valid')).toThrow(UuidInvalidException);
  });

  it('should throw for empty string', () => {
    expect(() => new UserId('')).toThrow(UuidInvalidException);
  });
});
