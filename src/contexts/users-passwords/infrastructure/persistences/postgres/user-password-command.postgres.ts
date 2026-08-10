import { UserPassword } from 'src/contexts/users-passwords/domain/entities/user-password.entity';
import { UserPasswordCommandRepository } from 'src/contexts/users-passwords/domain/ports';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';

export class UserPasswordCommandPostgres implements UserPasswordCommandRepository {
  constructor(private readonly _prisma$: PrismaPostgresAdapter) {}

  async create(userPassword: UserPassword): Promise<UserPassword> {
    // disable password by user
    await this._prisma$.userPassword.updateMany({
      where: { userId: userPassword._idUser._value, isCurrent: true },
      data: { isCurrent: false },
    });

    // create new password
    await this._prisma$.userPassword.create({
      data: {
        id: userPassword._id._value,
        userId: userPassword._idUser._value,
        password: userPassword.password.value,
        isCurrent: userPassword.isCurrentValue,
        createdAt: userPassword.createdAtValue,
      },
    });

    return userPassword;
  }
}
