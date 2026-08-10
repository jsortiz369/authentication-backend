import { PickType } from '@nestjs/swagger';

import { UserCreateDto } from 'src/contexts/users/infrastructure/http/dtos';

export class AuthRecoverPasswordDto extends PickType(UserCreateDto, ['username']) {}
