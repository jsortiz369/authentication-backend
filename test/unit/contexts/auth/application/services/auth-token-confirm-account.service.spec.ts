import { AuthTokenConfirmAccountService } from 'src/contexts/auth/application/services/auth-token-confirm-account.service';

const DATA = { _idUser: '550e8400-e29b-41d4-a716-446655440000', email: 'juan@example.com', names: 'Juan Garcia' };

const makeMocks = () => ({
  crypto: {
    token: jest.fn().mockReturnValue('123456'),
    hash: jest.fn().mockReturnValue('hashed-otp'),
  } as any,
  cache: { set: jest.fn().mockResolvedValue(undefined) } as any,
  event: { execute: jest.fn().mockResolvedValue(undefined) } as any,
  jwt: { generateConfirmAccount: jest.fn().mockReturnValue('confirm-jwt') } as any,
});

describe('AuthTokenConfirmAccountService', () => {
  it('should generate OTP, store in cache, enqueue email, and return JWT when createJwt=true', async () => {
    const m = makeMocks();
    const service = new AuthTokenConfirmAccountService(m.crypto, m.cache, m.event, m.jwt);

    const result = await service.execute(DATA, true);

    expect(m.crypto.token).toHaveBeenCalledWith({ kind: 'NUMBER' });
    expect(m.cache.set).toHaveBeenCalledWith(`confirm-account:${DATA._idUser}`, 'hashed-otp', expect.any(Number));
    expect(m.event.execute).toHaveBeenCalledWith({ code: '123456', email: DATA.email, names: DATA.names });
    expect(result).toEqual({ tokenConfirm: 'confirm-jwt' });
  });

  it('should NOT generate JWT when createJwt=false', async () => {
    const m = makeMocks();
    const service = new AuthTokenConfirmAccountService(m.crypto, m.cache, m.event, m.jwt);

    const result = await service.execute(DATA, false);

    expect(result).toBeUndefined();
    expect(m.jwt.generateConfirmAccount).not.toHaveBeenCalled();
    expect(m.event.execute).toHaveBeenCalledTimes(1);
  });
});
