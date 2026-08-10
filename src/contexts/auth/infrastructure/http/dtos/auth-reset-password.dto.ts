import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UserCreateDto } from 'src/contexts/users/infrastructure/http/dtos';

export class AuthResetPasswordDto extends PickType(UserCreateDto, ['password']) {
  @ApiProperty({ type: 'string', example: 'baa2ce8211efbe2be05b663d44f50bfb0920a635940fdb8fc2177687f8432c50' })
  @IsString({ message: 'The token is not valid, it must be alphanumeric.' })
  @IsNotEmpty({ message: 'The token must not be empty.' })
  @Length(64, 64, { message: 'The token must be 64 characters long.' })
  readonly token: string;
}
