import { User } from 'src/contexts/users/domain/entities/user.entity';
import { UserCreateCommand } from './user-create.command';
import { CryptoRepository } from 'src/shared/security/ports/crypto.repository';
import { UserQueryRepository } from 'src/contexts/users/domain/ports/user-query.repository';
import { UserCommandRepository } from 'src/contexts/users/domain/ports/user-command.repository';
import { UserConflictEmailException, UserConflictPhoneException, UserConflictUsernameException } from 'src/contexts/users/domain/exceptions';
import { UserPasswordCreateHandler } from 'src/contexts/users-passwords/application';

export class UserCreateHandler {
  constructor(
    private readonly _cryptoRepository$: CryptoRepository,
    private readonly _userQueryRepository$: UserQueryRepository,
    private readonly _userCommandRepository$: UserCommandRepository,
    private readonly _userPasswordCreateHandler$: UserPasswordCreateHandler,
  ) {}

  async execute(command: UserCreateCommand) {
    // prepare entity User
    const userEntity = User.create({
      _id: this._cryptoRepository$.generateUuidV4(),
      names: command.names,
      surnames: command.surnames,
      username: command.username,
      phone: command.phone,
      email: command.email,
    });

    //  validate if username exists
    const availableUsername = await this._userQueryRepository$.availableUsername(command.username);
    if (!availableUsername) throw new UserConflictUsernameException();

    // validate if email exists
    const availableEmail = await this._userQueryRepository$.availableEmail(command.email);
    if (!availableEmail) throw new UserConflictEmailException();

    // validate if phone exist
    const availablePhone = await this._userQueryRepository$.availablePhone(command.phone);
    if (!availablePhone) throw new UserConflictPhoneException();

    // register new user
    await this._userCommandRepository$.create(userEntity);

    // create password
    await this._userPasswordCreateHandler$.execute({
      userId: userEntity.id._value,
      password: command.password,
    });

    return userEntity;
  }
}
