import { UserSingInService, UserUpdateFailedAttemptsSingInServices } from 'src/contexts/users/domain/services';
import { AuthSingInCommand } from './auth-sing-in.command';
import {
  AccountBlockWarningException,
  AccountInactiveException,
  AccountLockException,
  IncorrectCredentialsException,
} from 'src/contexts/auth/domain/exceptions';
import { UserPasswordByIdUserService } from 'src/contexts/users-passwords/domain/services';
import { PasswordRepository } from 'src/shared/security/ports/password.repository';
import { AuthTokenAccessService, AuthTokenConfirmAccountService } from '../../../services';

export class AuthSingInHandler {
  constructor(
    private readonly _userForSingInService$: UserSingInService,
    private readonly _userPasswordByIdUserService$: UserPasswordByIdUserService,
    private readonly _passwordRepository$: PasswordRepository,
    private readonly _userUpdateFailedAttemptsService$: UserUpdateFailedAttemptsSingInServices,
    private readonly _authTokenConfirmAccountService$: AuthTokenConfirmAccountService,
    private readonly _authTokenAccessService$: AuthTokenAccessService,
  ) {}

  async execute(command: AuthSingInCommand) {
    // TODO: validate user
    const user = await this._userForSingInService$.execute(command.username);
    if (!user) throw new IncorrectCredentialsException();

    // TODO: update failed attempts
    let failedAttempts = (!user.failedAttempts || isNaN(user.failedAttempts) ? 0 : user.failedAttempts) + 1;
    let lockUntil: null | Date = user.lockUntil ? user.lockUntil : null;

    // TODO: reset failed attempts
    if (lockUntil && failedAttempts >= 5 && lockUntil < new Date()) {
      failedAttempts = 1;
      lockUntil = null;
    }

    const userPassword = await this._userPasswordByIdUserService$.execute(user._id);
    const isValidPassword = await this._passwordRepository$.compare(command.password, userPassword?.password ?? '');
    if (!isValidPassword) {
      if (!lockUntil) await this._userUpdateFailedAttemptsService$.execute(user._id, failedAttempts);
      if (failedAttempts == 4) throw new AccountBlockWarningException();
      else throw new IncorrectCredentialsException();
    }

    // TODO: validate user lock
    if (lockUntil) throw new AccountLockException();

    // TODO: update failed attempts
    await this._userUpdateFailedAttemptsService$.execute(user._id, 0);

    // TODO: validate user inactive
    if (!user.status) throw new AccountInactiveException();

    // TODO: validate user confirmed
    if (!user.confirmed) {
      const { tokenConfirm } = await this._authTokenConfirmAccountService$.execute(
        {
          _idUser: user._id,
          email: user.email,
          names: `${user.names} ${user.surnames}`,
        },
        true,
      );
      return { confirmAccount: true as const, token: tokenConfirm };
    }

    // TODO: auth token access
    const result = await this._authTokenAccessService$.execute({
      _id: user._id,
      username: user.username,
      email: user.email,
      names: user.names,
      surnames: user.surnames,
      ip: command.ip,
      browser: command.browser,
      version: command.version,
      os: command.os,
      device: command.device,
      userIdSession: command.userId,
      sessionId: command.sessionId,
    });

    return { ...result, confirmAccount: false as const };
  }
}
