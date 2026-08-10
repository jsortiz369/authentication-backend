import { UuidV4ValueObject } from 'src/shared/domain/values-objects/uuid-v4.vo';
import { UserPasswordPrimitive } from '../interfaces';

type UserPasswordIdProp = UserPasswordPrimitive['_id'];
export class UserPasswordId extends UuidV4ValueObject {
  constructor(value: UserPasswordIdProp) {
    super(value, 'The id field is not a valid uuidV4.'); // Validate UUID format
  }
}
