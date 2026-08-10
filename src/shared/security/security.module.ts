import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { PasswordRepository } from './ports/password.repository';
import { BcryptPasswordAdapter } from './adapters/bcrypt-password.adapter';
import { JwtRepository } from './ports/jwt.repository';
import { JwtAdapter } from './adapters/jwt.adapter';
import { EnvRepository } from '../env/ports/env.repository';
import { CryptoRepository } from './ports/crypto.repository';
import { CryptoAdapter } from './adapters/crypto.adapter';

@Module({
  imports: [JwtModule],
  providers: [
    {
      provide: PasswordRepository,
      useFactory: () => new BcryptPasswordAdapter(),
    },
    {
      provide: JwtRepository,
      useFactory: (jwt: JwtService, env: EnvRepository) => new JwtAdapter(jwt, env),
      inject: [JwtService, EnvRepository],
    },
    {
      provide: CryptoRepository,
      useFactory: () => new CryptoAdapter(),
    },
  ],
  exports: [PasswordRepository, JwtRepository, CryptoRepository],
})
export class SecurityModule {}
