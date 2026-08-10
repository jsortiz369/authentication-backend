import { UserCreatePrimitive, UserPrimitive } from '../interfaces';
import * as vo from '../vo';

export class User {
  constructor(
    private readonly _id$: vo.UserId,
    private _names$: vo.UserNames,
    private _surnames$: vo.UserSurnames,
    private _username$: vo.UserUsername,
    private _phone$: vo.UserPhone,
    private _email$: vo.UserEmail,
    private _confirmed$: boolean,
    private _status$: boolean,
    private _failedAttempts$: number | null,
    private _lockUntil$: Date | null,
    private _createdAt$: Date,
    private _updatedAt$: Date,
    private _deletedAt$: Date | null,
  ) {}

  static create(primitive: UserCreatePrimitive): User {
    const newCreatedAt = new Date();

    const userEntity = new User(
      new vo.UserId(primitive._id),
      new vo.UserNames(primitive.names),
      new vo.UserSurnames(primitive.surnames),
      new vo.UserUsername(primitive.username),
      new vo.UserPhone(primitive.phone),
      new vo.UserEmail(primitive.email),
      false,
      true,
      0,
      null,
      newCreatedAt,
      newCreatedAt,
      null,
    );

    return userEntity;
  }

  /* ensurePasswordNotContainsPersonalInfo(password: string): void {
    const passwordNormalized = password.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

    const forbiddenWords = [this._names$.value, this._surnames$.value]
      .join(' ')
      .split(' ')
      .map((word) => word.trim())
      .filter((word) => word.length >= 3); // ignore very short words like "de", "la"

    const found = forbiddenWords.find((word) => passwordNormalized.includes(word));
    if (found) throw new BadRequestException(`The password must not contain personal information.`);
  } */

  toValuesPrimitives(): UserPrimitive {
    return {
      _id: this._id$._value,
      names: this._names$.value,
      surnames: this._surnames$.value,
      username: this._username$.value,
      phone: this._phone$.value,
      email: this._email$.value,
      confirmed: this._confirmed$,
      status: this._status$,
      failedAttempts: this._failedAttempts$ ?? null,
      lockUntil: this._lockUntil$,
      createdAt: this._createdAt$,
      updatedAt: this._updatedAt$,
      deletedAt: this._deletedAt$,
    };
  }

  /*========== Getters =================*/
  get id(): vo.UserId {
    return this._id$;
  }

  get names(): vo.UserNames {
    return this._names$;
  }

  get surnames(): vo.UserSurnames {
    return this._surnames$;
  }

  get username(): vo.UserUsername {
    return this._username$;
  }

  get phone(): vo.UserPhone {
    return this._phone$;
  }

  get email(): vo.UserEmail {
    return this._email$;
  }

  get confirmed(): boolean {
    return this._confirmed$;
  }

  get status(): boolean {
    return this._status$;
  }

  get failedAttempts(): number | null {
    return this._failedAttempts$;
  }

  get lockUntil(): Date | null {
    return this._lockUntil$;
  }

  get createdAt(): Date {
    return this._createdAt$;
  }

  get updatedAt(): Date {
    return this._updatedAt$;
  }

  get deletedAt(): Date | null {
    return this._deletedAt$;
  }

  /*========== Setters =================*/
  set names(names: vo.UserNames) {
    this._names$ = names;
  }

  set surnames(surnames: vo.UserSurnames) {
    this._surnames$ = surnames;
  }

  set username(username: vo.UserUsername) {
    this._username$ = username;
  }

  set phone(phone: vo.UserPhone) {
    this._phone$ = phone;
  }

  set email(email: vo.UserEmail) {
    this._email$ = email;
  }

  set confirmed(confirmed: boolean) {
    this._confirmed$ = confirmed;
  }

  set status(status: boolean) {
    this._status$ = status;
  }

  set failedAttempts(failedAttempts: number | null) {
    this._failedAttempts$ = failedAttempts;
  }

  set lockUntil(lockUntil: Date | null) {
    this._lockUntil$ = lockUntil;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt$ = updatedAt;
  }

  set deletedAt(deletedAt: Date | null) {
    this._deletedAt$ = deletedAt;
  }
}
