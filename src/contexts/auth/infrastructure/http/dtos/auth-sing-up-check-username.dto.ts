import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { REGEX } from 'src/app/constants/reg-ex.constant';

export class AuthSingUpCheckUsernameDto {
  @ApiProperty({ type: 'string', minLength: 5, maxLength: 20, example: 'jogan.ortiz' })
  @IsString({ message: 'The username field must be a text string.' })
  @IsNotEmpty({ message: 'The username field is required.' })
  @Matches(REGEX.USERNAME, { message: 'The username is not valid, it must be letters and numbers with the characters _.-' })
  @Length(5, 20, { message: 'The surnames field must contain between 1 and 20 characters.' })
  readonly username: string;
}
