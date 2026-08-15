import { REGEX } from 'src/app/constants/reg-ex.constant';

describe('REGEX', () => {
  describe('UUID_V4', () => {
    it('should match a valid UUID v4', () => {
      expect(REGEX.UUID_V4.test('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should not match a v1 UUID', () => {
      expect(REGEX.UUID_V4.test('550e8400-e29b-11d4-a716-446655440000')).toBe(false);
    });

    it('should not match a random string', () => {
      expect(REGEX.UUID_V4.test('not-a-uuid')).toBe(false);
    });

    it('should match uppercase UUID', () => {
      expect(REGEX.UUID_V4.test('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    });
  });

  describe('LETTER_NUMBER_SPACE', () => {
    it('should match simple names', () => {
      expect(REGEX.LETTER_NUMBER_SPACE.test('Juan Carlos')).toBe(true);
    });

    it('should match accented characters', () => {
      expect(REGEX.LETTER_NUMBER_SPACE.test('María José')).toBe(true);
    });

    it('should match apostrophe names', () => {
      expect(REGEX.LETTER_NUMBER_SPACE.test("O'Connor")).toBe(true);
    });

    it('should not match special characters like @', () => {
      expect(REGEX.LETTER_NUMBER_SPACE.test('Juan@Carlos')).toBe(false);
    });

    it('should not match hyphenated names', () => {
      expect(REGEX.LETTER_NUMBER_SPACE.test('Juan-Carlos')).toBe(false);
    });
  });

  describe('EMAIL', () => {
    it('should match a valid email', () => {
      expect(REGEX.EMAIL.test('user@example.com')).toBe(true);
    });

    it('should match email with subdomain', () => {
      expect(REGEX.EMAIL.test('user@sub.example.com')).toBe(true);
    });

    it('should not match email without @', () => {
      expect(REGEX.EMAIL.test('userexample.com')).toBe(false);
    });

    it('should not match email without domain', () => {
      expect(REGEX.EMAIL.test('user@')).toBe(false);
    });

    it('should not match email with spaces', () => {
      expect(REGEX.EMAIL.test('user @example.com')).toBe(false);
    });
  });

  describe('PHONE', () => {
    it('should match a 10-digit phone', () => {
      expect(REGEX.PHONE.test('3184567852')).toBe(true);
    });

    it('should match a 7-digit phone (minimum)', () => {
      expect(REGEX.PHONE.test('3184567')).toBe(true);
    });

    it('should match a 15-digit phone (maximum)', () => {
      expect(REGEX.PHONE.test('318456785212345')).toBe(true);
    });

    it('should not match a 6-digit phone (too short)', () => {
      expect(REGEX.PHONE.test('318456')).toBe(false);
    });

    it('should not match a 16-digit phone (too long)', () => {
      expect(REGEX.PHONE.test('3184567852123456')).toBe(false);
    });

    it('should not match letters', () => {
      expect(REGEX.PHONE.test('31845abc')).toBe(false);
    });
  });

  describe('USERNAME', () => {
    it('should match a simple username', () => {
      expect(REGEX.USERNAME.test('jogan')).toBe(true);
    });

    it('should match username with dot', () => {
      expect(REGEX.USERNAME.test('jogan.ortiz')).toBe(true);
    });

    it('should match username with underscore', () => {
      expect(REGEX.USERNAME.test('jogan_ortiz')).toBe(true);
    });

    it('should match username with dash', () => {
      expect(REGEX.USERNAME.test('jogan-ortiz')).toBe(true);
    });

    it('should not match username with space', () => {
      expect(REGEX.USERNAME.test('jogan ortiz')).toBe(false);
    });

    it('should not match username with @', () => {
      expect(REGEX.USERNAME.test('jogan@ortiz')).toBe(false);
    });
  });

  describe('PASSWORD', () => {
    it('should match a valid password', () => {
      expect(REGEX.PASSWORD.test('Pass.1234')).toBe(true);
    });

    it('should match with special characters', () => {
      expect(REGEX.PASSWORD.test('Str0ng!Pass')).toBe(true);
    });

    it('should not match without uppercase', () => {
      expect(REGEX.PASSWORD.test('pass.1234')).toBe(false);
    });

    it('should not match without lowercase', () => {
      expect(REGEX.PASSWORD.test('PASS.1234')).toBe(false);
    });

    it('should not match without digit', () => {
      expect(REGEX.PASSWORD.test('Pass.abcd')).toBe(false);
    });

    it('should not match without special character', () => {
      expect(REGEX.PASSWORD.test('Pass1234a')).toBe(false);
    });

    it('should not match if shorter than 8 chars', () => {
      expect(REGEX.PASSWORD.test('Pa.1abc')).toBe(false);
    });

    it('should not match if longer than 64 chars', () => {
      const long = 'Aa1!' + 'a'.repeat(61);
      expect(REGEX.PASSWORD.test(long)).toBe(false);
    });

    it('should match with exactly 8 chars', () => {
      expect(REGEX.PASSWORD.test('Aa1!abcd')).toBe(true);
    });

    it('should match with exactly 64 chars', () => {
      const exact = 'Aa1!' + 'a'.repeat(60);
      expect(REGEX.PASSWORD.test(exact)).toBe(true);
    });
  });
});
