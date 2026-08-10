import { UserId } from 'src/contexts/users/domain/vo';
import * as vo from '../vo';
import { AuthCreatePrimitive, AuthPrimitive } from '../interfaces';

export class Auth {
  constructor(
    private readonly _id$: vo.AuthId,
    private _userId$: UserId,
    private _refreshTokenHash$: string,
    private _ip$: string | null,
    private _browser$: string | null,
    private _browserVersion$: string | null,
    private _operatingSystem$: string | null,
    private _device$: string | null,
    private _expiresAt$: Date,
    private _revokedAt$: Date,
    private _createdAt$: Date,
    private _updatedAt$: Date,
  ) {}

  static create(primitive: AuthCreatePrimitive): Auth {
    const newCreatedAt = new Date();

    return new Auth(
      new vo.AuthId(primitive._id),
      new UserId(primitive.userId),
      primitive.refreshTokenHash,
      primitive?.ip ?? null,
      primitive?.browser ?? null,
      primitive?.browserVersion ?? null,
      primitive?.operatingSystem ?? null,
      primitive?.device ?? null,
      primitive.expiresAt,
      primitive.revokedAt,
      newCreatedAt,
      newCreatedAt,
    );
  }

  toValuesPrimitives(): AuthPrimitive {
    return {
      _id: this._id$._value,
      userId: this._userId$._value,
      refreshTokenHash: this._refreshTokenHash$,
      ip: this._ip$,
      browser: this._browser$,
      browserVersion: this._browserVersion$,
      operatingSystem: this._operatingSystem$,
      device: this._device$,
      expiresAt: this._expiresAt$,
      revokedAt: this._revokedAt$,
      createdAt: this._createdAt$,
      updatedAt: this._updatedAt$,
    };
  }

  /*========== Getters =================*/
  get _id(): vo.AuthId {
    return this._id$;
  }

  get _idUser(): UserId {
    return this._userId$;
  }

  get refreshTokenHash(): string {
    return this._refreshTokenHash$;
  }

  get ip(): string | null | undefined {
    return this._ip$;
  }

  get browser(): string | null | undefined {
    return this._browser$;
  }

  get browserVersion(): string | null | undefined {
    return this._browserVersion$;
  }

  get operatingSystem(): string | null | undefined {
    return this._operatingSystem$;
  }

  get device(): string | null | undefined {
    return this._device$;
  }

  get expiresAt(): Date {
    return this._expiresAt$;
  }

  get revokedAt(): Date {
    return this._revokedAt$;
  }

  get createdAt(): Date {
    return this._createdAt$;
  }

  get updatedAt(): Date {
    return this._updatedAt$;
  }

  /*========== Setters =================*/
  set refreshTokenHash(tokenHas: string) {
    this._refreshTokenHash$ = tokenHas;
  }

  set expiresAt(expiresAt: Date) {
    this._expiresAt$ = expiresAt;
  }

  set revokedAt(revokedAt: Date) {
    this._revokedAt$ = revokedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt$ = updatedAt;
  }
}
