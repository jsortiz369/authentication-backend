import { AuthTokenAccessService } from 'src/contexts/auth/application/services/auth-token-access.service';

const BASE_DATA = {
  _id: '550e8400-e29b-41d4-a716-446655440000',
  names: 'Juan',
  surnames: 'Garcia',
  username: 'jgarcia',
  email: 'juan@example.com',
};

const SESSION_UUID = '660e8400-e29b-41d4-a716-446655440000';

const makeMocks = () => ({
  crypto: {
    generateUuidV4: jest.fn().mockReturnValue(SESSION_UUID),
    hash: jest.fn().mockReturnValue('hashed-refresh'),
  } as any,
  jwt: {
    expiresInToSeconds: jest.fn().mockReturnValue(604800),
    generate: jest.fn().mockReturnValue('access-jwt'),
    generateRefresh: jest.fn().mockReturnValue('refresh-jwt'),
  } as any,
  cache: { set: jest.fn().mockResolvedValue(undefined) } as any,
  authCommand: {
    createSession: jest.fn().mockResolvedValue(undefined),
    updateSession: jest.fn().mockResolvedValue(undefined),
  } as any,
  revokeService: { execute: jest.fn().mockResolvedValue(undefined) } as any,
});

describe('AuthTokenAccessService', () => {
  it('should create a new session when no existing session', async () => {
    const m = makeMocks();
    const service = new AuthTokenAccessService(m.crypto, m.jwt, m.cache, m.authCommand, m.revokeService);

    const result = await service.execute(BASE_DATA);

    expect(m.crypto.generateUuidV4).toHaveBeenCalledTimes(1);
    expect(m.authCommand.createSession).toHaveBeenCalledTimes(1);
    expect(m.cache.set).toHaveBeenCalledWith(`session:${SESSION_UUID}:user:${BASE_DATA._id}`, 'refresh-jwt', expect.any(Number));
    expect(result.token).toBe('access-jwt');
    expect(result.tokenRefresh).toBe('refresh-jwt');
    expect(result.data).toMatchObject({ names: 'Juan', email: 'juan@example.com' });
  });

  it('should reuse existing session when sessionId and userIdSession match', async () => {
    const m = makeMocks();
    const service = new AuthTokenAccessService(m.crypto, m.jwt, m.cache, m.authCommand, m.revokeService);

    const data = { ...BASE_DATA, sessionId: SESSION_UUID, userIdSession: BASE_DATA._id };
    const result = await service.execute(data);

    expect(m.authCommand.updateSession).toHaveBeenCalledTimes(1);
    expect(m.authCommand.createSession).not.toHaveBeenCalled();
    expect(m.crypto.generateUuidV4).not.toHaveBeenCalled();
    expect(result.token).toBe('access-jwt');
  });

  it('should revoke session and create new one when userIdSession does not match _id', async () => {
    const m = makeMocks();
    const service = new AuthTokenAccessService(m.crypto, m.jwt, m.cache, m.authCommand, m.revokeService);

    const data = {
      ...BASE_DATA,
      sessionId: SESSION_UUID,
      userIdSession: '770e8400-e29b-41d4-a716-446655440000', // different user
    };
    const result = await service.execute(data);

    expect(m.revokeService.execute).toHaveBeenCalledWith(SESSION_UUID, '770e8400-e29b-41d4-a716-446655440000');
    expect(m.authCommand.createSession).toHaveBeenCalledTimes(1);
    expect(result.token).toBe('access-jwt');
  });
});
