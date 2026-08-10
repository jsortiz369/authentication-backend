import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthSingUpConfirmDto {
  @ApiProperty({ type: 'string', example: '123456' })
  @IsString({ message: 'The token field must be a text string.' })
  @IsNotEmpty({ message: 'The token field is required.' })
  @Length(6, 6, { message: 'The token must be 6 characters long.' })
  readonly token: string;
}
