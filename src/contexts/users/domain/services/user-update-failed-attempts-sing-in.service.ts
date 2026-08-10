import { UserCommandRepository } from '../ports/user-command.repository';
import { UserId } from '../vo';

export class UserUpdateFailedAttemptsSingInServices {
  constructor(private readonly _userCommandRepository$: UserCommandRepository) {}

  async execute(id: string, failedAttempts: number) {
    const userId = new UserId(id);
    await this._userCommandRepository$.updateLoginAttempts(userId, failedAttempts);
  }
}
