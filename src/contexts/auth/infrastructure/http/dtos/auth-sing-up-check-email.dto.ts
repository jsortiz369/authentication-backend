import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { REGEX } from 'src/app/constants/reg-ex.constant';

export class AuthSingUpCheckEmailDto {
  @ApiProperty({ type: 'string', minLength: 5, maxLength: 100, example: 'jogan@prueba.com' })
  @IsString({ message: 'The email field must be a text string.' })
  @IsNotEmpty({ message: 'The email field must not be empty.' })
  @Matches(REGEX.EMAIL, { message: 'The email field is not a valid email.' })
  @Length(5, 100, { message: 'The email field must contain between 5 and 100 characters.' })
  readonly email: string;
}
