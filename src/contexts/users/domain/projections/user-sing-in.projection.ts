import { UserPrimitive } from '../interfaces';

type TypeProjection = Omit<UserPrimitive, 'deletedAt'>;
export class UserSingInProjection {
  constructor(
    readonly _id: NonNullable<Required<TypeProjection['_id']>>,
    readonly names: TypeProjection['names'],
    readonly surnames: TypeProjection['surnames'],
    readonly username: TypeProjection['username'],
    readonly email: TypeProjection['email'],
    readonly confirmed: TypeProjection['confirmed'],
    readonly status: TypeProjection['status'],
    readonly failedAttempts: TypeProjection['failedAttempts'],
    readonly lockUntil: TypeProjection['lockUntil'],
  ) {}
}
