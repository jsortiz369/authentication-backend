import { AuthSingUpCheckEmailHandler } from 'src/contexts/auth/application/use-case/queries/auth-sing-up-check-email/auth-sing-up-check-email.handler';
import { AuthSingUpCheckPhoneHandler } from 'src/contexts/auth/application/use-case/queries/auth-sing-up-check-phone/auth-sing-up-check-phone.handler';
import { AuthSingUpCheckUsernameHandler } from 'src/contexts/auth/application/use-case/queries/auth-sing-up-check-username/auth-sing-up-check-username.handler';

describe('AuthSingUpCheckEmailHandler', () => {
  it('should return available:true when email not taken', async () => {
    const checkEmail = { execute: jest.fn().mockResolvedValue({ available: true }) } as any;
    const handler = new AuthSingUpCheckEmailHandler(checkEmail);
    expect(await handler.execute({ email: 'new@e.com' } as any)).toEqual({ available: true });
  });

  it('should return available:false when email taken', async () => {
    const checkEmail = { execute: jest.fn().mockResolvedValue({ available: false }) } as any;
    const handler = new AuthSingUpCheckEmailHandler(checkEmail);
    expect(await handler.execute({ email: 'taken@e.com' } as any)).toEqual({ available: false });
  });
});

describe('AuthSingUpCheckPhoneHandler', () => {
  it('should delegate to UserCheckPhoneHandler', async () => {
    const checkPhone = { execute: jest.fn().mockResolvedValue({ available: true }) } as any;
    const handler = new AuthSingUpCheckPhoneHandler(checkPhone);
    expect(await handler.execute({ phone: '3184567852' } as any)).toEqual({ available: true });
  });
});

describe('AuthSingUpCheckUsernameHandler', () => {
  it('should delegate to UserCheckUsernameHandler', async () => {
    const checkUsername = { execute: jest.fn().mockResolvedValue({ available: true }) } as any;
    const handler = new AuthSingUpCheckUsernameHandler(checkUsername);
    expect(await handler.execute({ username: 'jgarcia' } as any)).toEqual({ available: true });
  });
});
