import { UuidInvalidException } from 'src/shared/domain/exeptions/uuid-invalid.exception';
import { AuthId } from 'src/contexts/auth/domain/vo/auth-id.vo';

describe('AuthId VO', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  it('should accept a valid UUID v4', () => {
    const vo = new AuthId(VALID_UUID);
    expect(vo._value).toBe(VALID_UUID);
  });

  it('should throw UuidInvalidException for invalid UUID', () => {
    expect(() => new AuthId('not-valid')).toThrow(UuidInvalidException);
  });

  it('should throw for empty string', () => {
    expect(() => new AuthId('')).toThrow(UuidInvalidException);
  });
});
