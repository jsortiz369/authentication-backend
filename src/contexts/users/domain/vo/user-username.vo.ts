import { StringValueObject } from 'src/shared/domain/values-objects/string.vo';
import { UserPrimitive } from '../interfaces';
import { REGEX } from 'src/app/constants/reg-ex.constant';

type UserUsernameProp = UserPrimitive['username'];
export class UserUsername extends StringValueObject<UserUsernameProp> {
  constructor(value: UserUsernameProp) {
    super(value, 'The username field must be a text string.');

    this.ensureIsDefined('The username field is required.'); // Not null or undefined
    this.ensureNotEmpty('The username field must not be empty.'); // Not empty string
    this.ensureIsFulfillRegExp(REGEX.USERNAME, 'The username is not valid, it must be letters and numbers with the characters _.-');
    this.ensureLength(5, 20, 'The surnames field must contain between 5 and 20 characters.'); // Length between 5 and 50 characters
  }
}
