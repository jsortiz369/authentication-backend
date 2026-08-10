import { UuidV4ValueObject } from 'src/shared/domain/values-objects/uuid-v4.vo';
import { UserPrimitive } from '../interfaces';

type UserIdProp = UserPrimitive['_id'];
export class UserId extends UuidV4ValueObject {
  constructor(value: UserIdProp) {
    super(value, 'The id field is not a valid uuidV4.'); // Validate UUID format
  }
}
