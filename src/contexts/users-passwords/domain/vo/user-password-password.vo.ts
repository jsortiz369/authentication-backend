import { StringValueObject } from 'src/shared/domain/values-objects/string.vo';
import { UserPasswordPrimitive } from '../interfaces';

type UserPasswordPasswordProp = UserPasswordPrimitive['password'];
export class UserPasswordPassword extends StringValueObject<UserPasswordPasswordProp> {
  constructor(value: UserPasswordPasswordProp) {
    super(value, 'The password field must be a text string.'); // Generic string validation

    this.ensureIsDefined('The names field is required.'); // Not null or undefined
    this.ensureNotEmpty('The names field must not be empty.'); // Not empty string
  }
}
