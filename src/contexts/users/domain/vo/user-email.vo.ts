import { StringValueObject } from 'src/shared/domain/values-objects/string.vo';
import { UserPrimitive } from '../interfaces';
import { REGEX } from 'src/app/constants/reg-ex.constant';

type UserEmailProp = UserPrimitive['email'];
export class UserEmail extends StringValueObject<UserEmailProp> {
  constructor(value: UserEmailProp) {
    super(value, 'The email field must be a text string.');

    this.ensureIsDefined('The email field is required.'); // Not null or undefined
    this.ensureNotEmpty('The email field must not be empty.'); // Not empty string
    this.ensureIsFulfillRegExp(REGEX.EMAIL, 'The email field is not a valid email.'); // Only letters and numbers
    this.ensureLength(5, 100, 'The email field must contain between 5 and 100 characters.'); // Length between 5 and 100 characters
  }
}
