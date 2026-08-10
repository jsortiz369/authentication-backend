import { PickType } from '@nestjs/swagger';

import { UserCreateDto } from 'src/contexts/users/infrastructure/http/dtos';

export class AuthSingInDto extends PickType(UserCreateDto, ['username', 'password']) {}
