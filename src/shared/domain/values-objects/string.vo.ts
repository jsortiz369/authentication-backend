import { BadRequestException } from '@nestjs/common';

export abstract class StringValueObject<T extends string | undefined | null> {
  private readonly _value$: T;

  protected constructor(value: T, message: string, config?: { capitalize?: boolean }) {
    let sanitized: T = !value ? value : (value.replace(/\s+/g, ' ').trim() as T);
    if (config?.capitalize && typeof sanitized === 'string') sanitized = StringValueObject._capitalize(sanitized);
    this._isString(sanitized, message);
    this._value$ = sanitized;
  }

  get value(): T {
    return this._value$;
  }

  protected ensureNotEmpty(message: string): void {
    if (this._value$ === '' || this._value$?.trim() === '') throw new BadRequestException(message);
  }

  protected ensureIsDefined(message: string): void {
    if (this._value$ === null || this._value$ === undefined) throw new BadRequestException(message);
  }

  protected ensureIsFulfillRegExp(regex: RegExp, message: string): void {
    if (this._value$ && !regex.test(this._value$)) throw new BadRequestException(message);
  }

  protected ensureLength(min: number, max: number, message: string): void {
    if (this._minLength(min) || this._maxLength(max)) throw new BadRequestException(message);
  }

  protected ensureMinLength(min: number, message: string): void {
    if (this._minLength(min)) throw new BadRequestException(message);
  }

  protected ensureMaxLength(max: number, message: string): void {
    if (this._maxLength(max)) throw new BadRequestException(message);
  }

  private _minLength(min: number): boolean {
    return this._value$ !== undefined && this._value$ !== null && this._value$.length < min;
  }

  private _maxLength(limit: number): boolean {
    return this._value$ !== undefined && this._value$ !== null && this._value$.length > limit;
  }

  private _isString(value: T, message: string): void {
    if (value === null || value === undefined) return;
    if (typeof value !== 'string') throw new BadRequestException(message);
  }

  private static _capitalize<S extends string>(value: S): S {
    return value
      .split(' ')
      .filter((word) => word !== '')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') as S;
  }
}
