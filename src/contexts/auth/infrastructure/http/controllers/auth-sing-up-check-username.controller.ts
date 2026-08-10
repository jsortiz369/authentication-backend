import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ROUTES } from 'src/app/constants/routes.constant';
import { AuthSingUpCheckUsernameHandler } from 'src/contexts/auth/application';
import { AuthSingUpCheckUsernameDto } from '../dtos/auth-sing-up-check-username.dto';

@ApiTags(ROUTES.AUTH)
@Controller(ROUTES.AUTH)
export class AuthSingUpCheckUsernameController {
  constructor(private readonly _handler$: AuthSingUpCheckUsernameHandler) {}

  @Get('/sing-up/check-username')
  @ApiOperation({ summary: 'check if an username already exists' })
  async execute(@Query() query: AuthSingUpCheckUsernameDto) {
    return await this._handler$.execute({
      username: query.username,
    });
  }
}
