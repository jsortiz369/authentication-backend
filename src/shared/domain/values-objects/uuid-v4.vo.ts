import { UuidInvalidException } from '../exeptions/uuid-invalid.exception';

const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export abstract class UuidV4ValueObject {
  readonly _value: string;

  constructor(value: string, message: string) {
    this.isUuidV4(value, message); // Ensure the value is a valid UUID v4
    this._value = value;
  }

  private isUuidV4(value: string, message: string): void {
    if (REGEX_UUID.test(value) === false) throw new UuidInvalidException(message);
    return;
  }
}
