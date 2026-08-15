import { UserCheckEmailHandler } from 'src/contexts/users/application/use-case/queries/user-check-email/user-check-email.handler';
import { UserCheckPhoneHandler } from 'src/contexts/users/application/use-case/queries/user-check-phone/user-check-phone.handler';
import { UserCheckUsernameHandler } from 'src/contexts/users/application/use-case/queries/user-check-username/user-check-username.handler';

describe('UserCheckEmailHandler', () => {
  it('should return available:true when email is free', async () => {
    const repo = { availableEmail: jest.fn().mockResolvedValue(true) } as any;
    const handler = new UserCheckEmailHandler(repo);
    expect(await handler.execute({ email: 'new@e.com' })).toEqual({ available: true });
  });

  it('should return available:false when email is taken', async () => {
    const repo = { availableEmail: jest.fn().mockResolvedValue(false) } as any;
    const handler = new UserCheckEmailHandler(repo);
    expect(await handler.execute({ email: 'taken@e.com' })).toEqual({ available: false });
  });
});

describe('UserCheckPhoneHandler', () => {
  it('should return available:true when phone is free', async () => {
    const repo = { availablePhone: jest.fn().mockResolvedValue(true) } as any;
    const handler = new UserCheckPhoneHandler(repo);
    expect(await handler.execute({ phone: '3184567852' })).toEqual({ available: true });
  });

  it('should return available:false when phone is taken', async () => {
    const repo = { availablePhone: jest.fn().mockResolvedValue(false) } as any;
    const handler = new UserCheckPhoneHandler(repo);
    expect(await handler.execute({ phone: '3184567852' })).toEqual({ available: false });
  });
});

describe('UserCheckUsernameHandler', () => {
  it('should return available:true when username is free', async () => {
    const repo = { availableUsername: jest.fn().mockResolvedValue(true) } as any;
    const handler = new UserCheckUsernameHandler(repo);
    expect(await handler.execute({ username: 'newuser' })).toEqual({ available: true });
  });

  it('should return available:false when username is taken', async () => {
    const repo = { availableUsername: jest.fn().mockResolvedValue(false) } as any;
    const handler = new UserCheckUsernameHandler(repo);
    expect(await handler.execute({ username: 'taken' })).toEqual({ available: false });
  });
});
