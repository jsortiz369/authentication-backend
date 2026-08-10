import { StringValueObject } from 'src/shared/domain/values-objects/string.vo';
import { UserPrimitive } from '../interfaces';
import { REGEX } from 'src/app/constants/reg-ex.constant';

type UserNamesProp = UserPrimitive['names'];
export class UserNames extends StringValueObject<UserNamesProp> {
  constructor(value: UserNamesProp) {
    super(value, 'The names field must be a text string.', { capitalize: true });

    this.ensureIsDefined('The names field is required.'); // Not null or undefined
    this.ensureNotEmpty('The names field must not be empty.'); // Not empty string
    this.ensureIsFulfillRegExp(REGEX.LETTER_NUMBER_SPACE, 'The names field is not valid, it must be letters, numbers, and spaces.'); // Only letters and numbers
    this.ensureLength(1, 50, 'The names field must contain between 1 and 50 characters.'); // Length between 1 and 50 characters
  }
}
