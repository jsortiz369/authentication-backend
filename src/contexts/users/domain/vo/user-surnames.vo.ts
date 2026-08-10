import { StringValueObject } from 'src/shared/domain/values-objects/string.vo';
import { UserPrimitive } from '../interfaces';
import { REGEX } from 'src/app/constants/reg-ex.constant';

type UserSurnamesProp = UserPrimitive['surnames'];
export class UserSurnames extends StringValueObject<UserSurnamesProp> {
  constructor(value: UserSurnamesProp) {
    super(value, 'The surnames field must be a text string.', { capitalize: true });

    this.ensureIsDefined('The surnames field is required.'); // Not null or undefined
    this.ensureNotEmpty('The surnames field must not be empty.'); // Not empty string
    this.ensureIsFulfillRegExp(REGEX.LETTER_NUMBER_SPACE, 'The surnames field is not valid, it must be letters, numbers, and spaces.'); // Only letters and numbers
    this.ensureLength(1, 50, 'The surnames field must contain between 1 and 50 characters.'); // Length between 1 and 50 characters
  }
}
