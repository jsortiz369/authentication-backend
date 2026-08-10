import { UserId } from 'src/contexts/users/domain/vo';
import * as vo from '../vo';
import { UserPasswordCreatePrimitive, UserPasswordPrimitive } from '../interfaces';

export class UserPassword {
  constructor(
    private readonly _id$: vo.UserPasswordId,
    private _userId$: UserId,
    private _password$: vo.UserPasswordPassword,
    private _isCurrent$: boolean,
    private _createdAt$: Date,
  ) {}

  static create(primitive: UserPasswordCreatePrimitive): UserPassword {
    return new UserPassword(
      new vo.UserPasswordId(primitive._id),
      new UserId(primitive.userId),
      new vo.UserPasswordPassword(primitive.password),
      true,
      new Date(),
    );
  }

  toValuesPrimitives(): UserPasswordPrimitive {
    return {
      _id: this._id$._value,
      userId: this._userId$._value,
      password: this._password$.value,
      isCurrent: this._isCurrent$,
      createdAt: this._createdAt$,
    };
  }

  /*========== Getters =================*/
  get _id(): vo.UserPasswordId {
    return this._id$;
  }

  get _idUser(): UserId {
    return this._userId$;
  }

  get password(): vo.UserPasswordPassword {
    return this._password$;
  }

  get isCurrentValue(): boolean {
    return this._isCurrent$;
  }

  get createdAtValue(): Date {
    return this._createdAt$;
  }
}
