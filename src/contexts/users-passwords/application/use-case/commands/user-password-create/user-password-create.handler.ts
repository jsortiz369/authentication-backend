import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { UserPasswordCreateCommand } from './user-password-create.command';
import { PasswordRepository } from 'src/shared/security/ports/password.repository';
import { UserPasswordCommandRepository, UserPasswordQueryRepository } from 'src/contexts/users-passwords/domain/ports';
import { UserPasswordConflictCreatePasswordException } from 'src/contexts/users-passwords/domain/exceptions';
import { UserPassword } from 'src/contexts/users-passwords/domain/entities/user-password.entity';

export class UserPasswordCreateHandler {
  constructor(
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _passwordRepository$: PasswordRepository,
    private readonly _userPasswordQueryRepository$: UserPasswordQueryRepository,
    private readonly _userPasswordCommandRepository$: UserPasswordCommandRepository,
  ) {}

  async execute(command: UserPasswordCreateCommand) {
    // TODO: Get last 3 passwords
    const findAllPasswords = await this._userPasswordQueryRepository$.findAllByIdUser(command.userId, 3);

    for (let index = 0; index < findAllPasswords.length; index++) {
      const item = findAllPasswords[index];
      const existPassword = await this._passwordRepository$.compare(command.password, item.password);
      if (existPassword) throw new UserPasswordConflictCreatePasswordException();
    }

    // prepare userPassword
    const userPasswordEntity = UserPassword.create({
      _id: this._cryptoRepository$.generateUuidV4(),
      userId: command.userId,
      password: await this._passwordRepository$.hash(command.password),
    });

    await this._userPasswordCommandRepository$.create(userPasswordEntity);
  }
}
