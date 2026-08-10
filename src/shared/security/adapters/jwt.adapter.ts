import { JwtService } from '@nestjs/jwt';

import { JwtRepository } from '../ports/jwt.repository';
import { EnvRepository } from 'src/shared/env/ports/env.repository';

export class JwtAdapter implements JwtRepository {
  constructor(
    private readonly _jwt$: JwtService,
    private readonly _env$: EnvRepository,
  ) {}

  generate<T extends object = any>(payload: T): string {
    return this._jwt$.sign<T>(payload, {
      secret: this._env$.env('JWT_SECRET'),
      expiresIn: this._env$.env('JWT_EXPIRES_IN'),
    });
  }

  generateRefresh<T extends object = any>(payload: T): string {
    return this._jwt$.sign<T>(payload, {
      secret: this._env$.env('JWT_REFRESH_SECRET'),
      expiresIn: this._env$.env('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  generateConfirmAccount(payload: { sub: string }): string {
    return this._jwt$.sign(payload, {
      secret: this._env$.env('JWT_CONFIRM_SECRET'),
      expiresIn: '1h',
    });
  }

  verify<T extends object = any>(token: string): T {
    return this._jwt$.verify<T>(token, { secret: this._env$.env('JWT_SECRET') });
  }

  verifyRefresh<T extends object = any>(token: string): T {
    return this._jwt$.verify<T>(token, { secret: this._env$.env('JWT_REFRESH_SECRET') });
  }

  verifyConfirmAccount(token: string): { sub: string; iat: number; exp: number } {
    return this._jwt$.verify<{ sub: string; iat: number; exp: number }>(token, { secret: this._env$.env('JWT_CONFIRM_SECRET') });
  }

  expiresInToSeconds(type: 'generate' | 'generateRefresh'): number {
    let expiresIn = this._env$.env('JWT_EXPIRES_IN');
    if (type === 'generateRefresh') expiresIn = this._env$.env('JWT_REFRESH_EXPIRES_IN');

    if (!isNaN(Number(expiresIn))) return Number(expiresIn);

    const match = String(expiresIn).match(/^(\d+)\s*([a-zA-Z]+)$/);

    if (!match) throw new Error(`Formato de tiempo inválido: ${expiresIn}`);

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case 'ms':
      case 'msec':
      case 'msecs':
      case 'millisecond':
      case 'milliseconds':
        return Math.floor(value / 1000);

      case 's':
      case 'sec':
      case 'secs':
      case 'second':
      case 'seconds':
        return value;

      case 'm':
      case 'min':
      case 'mins':
      case 'minute':
      case 'minutes':
        return value * 60;

      case 'h':
      case 'hr':
      case 'hrs':
      case 'hour':
      case 'hours':
        return value * 60 * 60;

      case 'd':
      case 'day':
      case 'days':
        return value * 60 * 60 * 24;

      case 'w':
      case 'week':
      case 'weeks':
        return value * 60 * 60 * 24 * 7;

      case 'y':
      case 'yr':
      case 'yrs':
      case 'year':
      case 'years':
        return value * 60 * 60 * 24 * 365;

      default:
        throw new Error(`Unidad de tiempo no soportada: ${unit}`);
    }
  }
}
