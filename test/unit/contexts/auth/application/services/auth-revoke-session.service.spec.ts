import { AuthRevokeSessionService } from 'src/contexts/auth/application/services/auth-revoke-session.service';

const SESSION_UUID = '550e8400-e29b-41d4-a716-446655440000';
const USER_UUID = '660e8400-e29b-41d4-a716-446655440000';

describe('AuthRevokeSessionService', () => {
  it('should revoke session in DB and delete from cache', async () => {
    const commandRepo = { revokeSession: jest.fn().mockResolvedValue(undefined) } as any;
    const cache = { delete: jest.fn().mockResolvedValue(undefined) } as any;
    const service = new AuthRevokeSessionService(commandRepo, cache);

    await service.execute(SESSION_UUID, USER_UUID);

    expect(commandRepo.revokeSession).toHaveBeenCalledTimes(1);
    expect(commandRepo.revokeSession.mock.calls[0][0]._value).toBe(SESSION_UUID);
    expect(commandRepo.revokeSession.mock.calls[0][1]._value).toBe(USER_UUID);
    expect(cache.delete).toHaveBeenCalledWith(`session:${SESSION_UUID}:user:${USER_UUID}`);
  });
});
