import { of } from 'rxjs';
import { ExecutionContext } from '@nestjs/common';
import { RequestAgentInterceptor } from 'src/app/interceptors/request-agent.interceptor';

interface UserAgentData {
  browser: string | null;
  version: string | null;
  device: string;
  os: string | null;
}

interface MockRequest {
  headers: { 'user-agent'?: string };
  userAgentData: UserAgentData | undefined;
}

const createMockContext = (userAgent?: string): { context: ExecutionContext; req: MockRequest } => {
  const req: MockRequest = {
    headers: { 'user-agent': userAgent },
    userAgentData: undefined,
  };

  const context = {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
  } as unknown as ExecutionContext;

  return { context, req };
};

const mockNext = { handle: () => of('response') };

describe('RequestAgentInterceptor', () => {
  let interceptor: RequestAgentInterceptor;

  beforeEach(() => {
    interceptor = new RequestAgentInterceptor();
  });

  it('should parse Chrome browser on Windows', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const { context, req } = createMockContext(ua);

    interceptor.intercept(context, mockNext);

    const data = req.userAgentData!;
    expect(data.browser).toBe('Chrome');
    expect(data.version).toContain('120');
    expect(data.os).toBe('Windows');
    expect(data.device).toBe('Desktop');
  });

  it('should parse mobile device', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
    const { context, req } = createMockContext(ua);

    interceptor.intercept(context, mockNext);

    const data = req.userAgentData!;
    expect(data.browser).toBe('Mobile Safari');
    expect(data.device).toBe('mobile');
    expect(data.os).toBe('iOS');
  });

  it('should default device to Desktop when type is undefined', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';
    const { context, req } = createMockContext(ua);

    interceptor.intercept(context, mockNext);

    expect(req.userAgentData!.device).toBe('Desktop');
  });

  it('should set null for missing fields when user-agent is undefined', () => {
    const { context, req } = createMockContext(undefined);

    interceptor.intercept(context, mockNext);

    const data = req.userAgentData!;
    expect(data.browser).toBeNull();
    expect(data.version).toBeNull();
    expect(data.os).toBeNull();
    expect(data.device).toBe('Desktop');
  });

  it('should call next.handle() and return the observable', (done) => {
    const { context } = createMockContext('Chrome');

    interceptor.intercept(context, mockNext).subscribe((value) => {
      expect(value).toBe('response');
      done();
    });
  });
});
