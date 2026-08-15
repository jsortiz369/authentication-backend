import { BadRequestException } from '@nestjs/common';
import { AuthRevokeSessionCommand } from './auth-revoke-session.command';
import { AuthRevokeSessionService } from '../../../services/auth-revoke-session.service';

export class AuthRevokeSessionHandler {
  constructor(private readonly _authRevokeSessionService$: AuthRevokeSessionService) {}

  async execute(command: AuthRevokeSessionCommand): Promise<void> {
    // Cannot revoke your own current session (use logout instead)
    if (command.sessionIdToRevoke === command.currentSessionId) {
      throw new BadRequestException('Cannot revoke the current session. Use logout instead.');
    }

    await this._authRevokeSessionService$.execute(command.sessionIdToRevoke, command.idUser);
  }
}
