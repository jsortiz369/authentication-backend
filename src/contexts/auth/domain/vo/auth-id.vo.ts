import { UuidV4ValueObject } from 'src/shared/domain/values-objects/uuid-v4.vo';
import { AuthPrimitive } from '../interfaces';

type AuthIdProp = AuthPrimitive['_id'];
export class AuthId extends UuidV4ValueObject {
  constructor(value: AuthIdProp) {
    super(value, 'The id field is not a valid uuidV4.'); // Validate UUID format
  }
}
