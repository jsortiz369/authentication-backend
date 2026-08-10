import { PickType } from '@nestjs/swagger';

import { AuthResetPasswordDto } from './auth-reset-password.dto';

export class AuthResetPasswordVerifyTokenDto extends PickType(AuthResetPasswordDto, ['token']) {}
