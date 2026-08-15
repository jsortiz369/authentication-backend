import { AuthSingUpResendTokenConfirmHandler } from 'src/contexts/auth/application/use-case/commands/auth-sing-up-resend-token-confirm/auth-sing-up-resend-token-confirm.handler';
import { AuthSingUpResendTokenConfirmCommand } from 'src/contexts/auth/application/use-case/commands/auth-sing-up-resend-token-confirm/auth-sing-up-resend-token-confirm.command';
import { AccountAlreadyConfirmedException } from 'src/contexts/auth/domain/exceptions/accont-already-confirmed.exception';

const COMMAND = new AuthSingUpResendTokenConfirmCommand('user-uuid');

describe('AuthSingUpResendTokenConfirmHandler', () => {
  it('should resend email when not confirmed', async () => {
    const user = { _id: 'user-uuid', email: 'j@e.com', names: 'Juan', surnames: 'Garcia', confirmed: false };
    const userService = { execute: jest.fn().mockResolvedValue(user) } as any;
    const confirmService = { execute: jest.fn().mockResolvedValue(undefined) } as any;
    const handler = new AuthSingUpResendTokenConfirmHandler(userService, confirmService);

    await handler.execute(COMMAND);
    expect(confirmService.execute).toHaveBeenCalledWith({ _idUser: 'user-uuid', email: 'j@e.com', names: 'Juan Garcia' }, false);
  });

  it('should throw AccountAlreadyConfirmedException when already confirmed', async () => {
    const user = { _id: 'user-uuid', confirmed: true };
    const userService = { execute: jest.fn().mockResolvedValue(user) } as any;
    const confirmService = { execute: jest.fn() } as any;
    const handler = new AuthSingUpResendTokenConfirmHandler(userService, confirmService);

    await expect(handler.execute(COMMAND)).rejects.toThrow(AccountAlreadyConfirmedException);
  });
});
