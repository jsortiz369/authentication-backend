import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { REGEX } from 'src/app/constants/reg-ex.constant';

export class UserCreateDto {
  @ApiProperty({ type: 'string', minLength: 1, maxLength: 50, example: 'Jogan' })
  @IsString({ message: 'The names field must be a text string.' })
  @IsNotEmpty({ message: 'The names field must not be empty.' })
  @Matches(REGEX.LETTER_NUMBER_SPACE, { message: 'The names field is not valid, it must be letters, numbers, and spaces.' })
  @Length(1, 50, { message: 'The names field must be between 1 and 50 characters.' })
  readonly names: string;

  @ApiProperty({ type: 'string', minLength: 1, maxLength: 50, example: 'Ortiz Muñoz' })
  @IsString({ message: 'The surnames field must be a text string.' })
  @IsNotEmpty({ message: 'The surnames field must not be empty.' })
  @Matches(REGEX.LETTER_NUMBER_SPACE, { message: 'The names field is not valid, it must be letters, numbers, and spaces.' })
  @Length(1, 50, { message: 'The names field must be between 1 and 50 characters.' })
  readonly surnames: string;

  @ApiProperty({ type: 'string', minLength: 5, maxLength: 20, example: 'jogan.ortiz' })
  @IsString({ message: 'The username field must be a text string.' })
  @IsNotEmpty({ message: 'The username field is required.' })
  @Matches(REGEX.USERNAME, { message: 'The username is not valid, it must be letters and numbers with the characters _.-' })
  @Length(5, 20, { message: 'The surnames field must contain between 1 and 20 characters.' })
  readonly username: string;

  @ApiProperty({ type: 'string', minLength: 7, maxLength: 15, example: '3184567852' })
  @IsString({ message: 'The phone field must be a text string.' })
  @IsNotEmpty({ message: 'The phone field must not be empty.' })
  @Matches(REGEX.PHONE, { message: 'The phone field is not valid.' })
  @Length(7, 15, { message: 'The phone field must contain between 7 and 15 numbers.' })
  readonly phone: string;

  @ApiProperty({ type: 'string', minLength: 5, maxLength: 100, example: 'jogan@prueba.com' })
  @IsString({ message: 'The email field must be a text string.' })
  @IsNotEmpty({ message: 'The email field must not be empty.' })
  @Matches(REGEX.EMAIL, { message: 'The email field is not a valid email.' })
  @Length(5, 100, { message: 'The email field must contain between 5 and 100 characters.' })
  readonly email: string;

  @ApiProperty({ type: 'string', minLength: 8, maxLength: 64, example: 'Prueba.85' })
  @IsString({ message: 'The password field must be a text string.' })
  @IsNotEmpty({ message: 'The password field must not be empty.' })
  @Matches(REGEX.PASSWORD, {
    message:
      'The password must have at least one uppercase letter, one lowercase letter, a number, and a special character. The length must be between 8 and 64 characters.',
  })
  readonly password: string;
}
