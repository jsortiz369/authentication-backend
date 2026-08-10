import { StringValueObject } from 'src/shared/domain/values-objects/string.vo';
import { UserPrimitive } from '../interfaces';
import { REGEX } from 'src/app/constants/reg-ex.constant';

type UserPhoneProp = UserPrimitive['phone'];
export class UserPhone extends StringValueObject<UserPhoneProp> {
  constructor(value: UserPhoneProp) {
    super(value, 'The phone field must be a text string.');

    this.ensureIsDefined('The phone field is required.'); // Not null or undefined
    this.ensureNotEmpty('The phone field must not be empty.'); // Not empty string
    this.ensureIsFulfillRegExp(REGEX.PHONE, 'The phone field is not valid.'); // Only letters and numbers
    this.ensureLength(7, 15, 'The phone field must contain between 7 and 15 numbers.'); // Length between 1 and 50 characters
  }
}
