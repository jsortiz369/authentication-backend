import { UserCommandRepository } from '../ports/user-command.repository';
import { UserId } from '../vo';

export class UserUpdateConfirmService {
  constructor(private readonly _userCommandRepository$: UserCommandRepository) {}

  async execute(idUser: string): Promise<void> {
    const userId = new UserId(idUser);
    await this._userCommandRepository$.updateConfirmed(userId);
    return;
  }
}
