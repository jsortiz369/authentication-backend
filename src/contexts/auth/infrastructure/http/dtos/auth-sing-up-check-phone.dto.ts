import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { REGEX } from 'src/app/constants/reg-ex.constant';

export class AuthSingUpCheckPhoneDto {
  @ApiProperty({ type: 'string', minLength: 7, maxLength: 15, example: '3184567852' })
  @IsString({ message: 'The phone field must be a text string.' })
  @IsNotEmpty({ message: 'The phone field must not be empty.' })
  @Matches(REGEX.PHONE, { message: 'The phone field is not valid.' })
  @Length(7, 15, { message: 'The phone field must contain between 7 and 15 numbers.' })
  readonly phone: string;
}
