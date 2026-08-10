import { UserPrimitive } from '../interfaces';

type TypeProjection = Omit<UserPrimitive, 'deletedAt'>;
export class UserFindOneByIdProjection implements TypeProjection {

  constructor(
    readonly _id: NonNullable<Required<TypeProjection['_id']>>,
    readonly names: TypeProjection['names'],
    readonly surnames: TypeProjection['surnames'],
    readonly username: TypeProjection['username'],
    readonly phone: TypeProjection['phone'],
    readonly email: TypeProjection['email'],
    readonly confirmed: TypeProjection['confirmed'],
    readonly status: TypeProjection['status'],
    readonly createdAt: TypeProjection['createdAt'],
    readonly updatedAt: TypeProjection['updatedAt'],
  ) {}
}
