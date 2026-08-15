import { UuidInvalidException } from 'src/shared/domain/exeptions/uuid-invalid.exception';
import { UuidV4ValueObject } from 'src/shared/domain/values-objects/uuid-v4.vo';

class TestUuid extends UuidV4ValueObject {
  constructor(value: string) {
    super(value, 'Invalid UUID v4');
  }
}

describe('UuidV4ValueObject', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  it('should store a valid UUID v4', () => {
    const vo = new TestUuid(VALID_UUID);
    expect(vo._value).toBe(VALID_UUID);
  });

  it('should throw UuidInvalidException for empty string', () => {
    expect(() => new TestUuid('')).toThrow(UuidInvalidException);
  });

  it('should throw UuidInvalidException for non-UUID string', () => {
    expect(() => new TestUuid('not-a-uuid')).toThrow(UuidInvalidException);
  });

  it('should throw UuidInvalidException for a v1 UUID', () => {
    expect(() => new TestUuid('550e8400-e29b-11d4-a716-446655440000')).toThrow(UuidInvalidException);
  });

  it('should accept uppercase UUID v4', () => {
    const upper = VALID_UUID.toUpperCase();
    const vo = new TestUuid(upper);
    expect(vo._value).toBe(upper);
  });
});
