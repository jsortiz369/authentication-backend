import { BadRequestException } from '@nestjs/common';
import { StringValueObject } from 'src/shared/domain/values-objects/string.vo';

class RequiredString extends StringValueObject<string> {
  constructor(value: string) {
    super(value, 'Must be a string');
    this.ensureIsDefined('Required');
    this.ensureNotEmpty('Cannot be empty');
  }
}

class BoundedString extends StringValueObject<string> {
  constructor(value: string) {
    super(value, 'Must be a string');
    this.ensureLength(3, 10, 'Must be between 3 and 10 characters');
  }
}

class RegexString extends StringValueObject<string> {
  constructor(value: string) {
    super(value, 'Must be a string');
    this.ensureIsFulfillRegExp(/^[a-z]+$/, 'Only lowercase letters');
  }
}

class CapitalizedString extends StringValueObject<string> {
  constructor(value: string) {
    super(value, 'Must be a string', { capitalize: true });
  }
}

class OptionalString extends StringValueObject<string | null | undefined> {
  constructor(value: string | null | undefined) {
    super(value, 'Must be a string');
  }
}

describe('StringValueObject', () => {
  describe('value getter', () => {
    it('should return trimmed value', () => {
      const vo = new RequiredString('  hello  ');
      expect(vo.value).toBe('hello');
    });

    it('should collapse multiple spaces into one', () => {
      const vo = new RequiredString('hello   world');
      expect(vo.value).toBe('hello world');
    });
  });

  describe('ensureIsDefined', () => {
    it('should throw when value is null', () => {
      class NullCheck extends StringValueObject<null> {
        constructor() {
          super(null, 'msg');
          this.ensureIsDefined('Required');
        }
      }
      expect(() => new NullCheck()).toThrow(BadRequestException);
    });

    it('should throw when value is undefined', () => {
      class UndCheck extends StringValueObject<undefined> {
        constructor() {
          super(undefined, 'msg');
          this.ensureIsDefined('Required');
        }
      }
      expect(() => new UndCheck()).toThrow(BadRequestException);
    });
  });

  describe('ensureNotEmpty', () => {
    it('should throw when value is empty', () => {
      expect(() => new RequiredString('')).toThrow(BadRequestException);
    });

    it('should throw when value is whitespace only', () => {
      expect(() => new RequiredString('   ')).toThrow(BadRequestException);
    });
  });

  describe('ensureLength', () => {
    it('should accept value within bounds', () => {
      expect(() => new BoundedString('hello')).not.toThrow();
    });

    it('should throw when too short', () => {
      expect(() => new BoundedString('ab')).toThrow(BadRequestException);
    });

    it('should throw when too long', () => {
      expect(() => new BoundedString('toolongstring')).toThrow(BadRequestException);
    });
  });

  describe('ensureIsFulfillRegExp', () => {
    it('should accept matching value', () => {
      expect(() => new RegexString('hello')).not.toThrow();
    });

    it('should throw for non-matching value', () => {
      expect(() => new RegexString('Hello123')).toThrow(BadRequestException);
    });
  });

  describe('capitalize', () => {
    it('should capitalize each word', () => {
      const vo = new CapitalizedString('juan carlos');
      expect(vo.value).toBe('Juan Carlos');
    });

    it('should lowercase rest of each word', () => {
      const vo = new CapitalizedString('JOHN DOE');
      expect(vo.value).toBe('John Doe');
    });
  });

  describe('optional value', () => {
    it('should accept null', () => {
      expect(() => new OptionalString(null)).not.toThrow();
    });

    it('should accept undefined', () => {
      expect(() => new OptionalString(undefined)).not.toThrow();
    });
  });
});
