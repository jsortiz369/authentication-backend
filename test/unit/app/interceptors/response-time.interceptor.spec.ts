import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

import { ResponseTimeInterceptor } from 'src/app/interceptors/response-time.interceptor';
import { LoggerRepository } from 'src/shared/logger/ports/logger.repository';

const mockLogger: jest.Mocked<LoggerRepository> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const createMockContext = () => {
  const req = { method: 'GET', url: '/api/v1/test' };
  const res = { statusCode: 200, header: jest.fn() };

  return {
    context: {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as ExecutionContext,
    req,
    res,
  };
};

describe('ResponseTimeInterceptor', () => {
  let interceptor: ResponseTimeInterceptor;

  beforeEach(() => {
    interceptor = new ResponseTimeInterceptor(mockLogger);
    jest.clearAllMocks();
  });

  it('should call next.handle() and emit the response', (done) => {
    const { context } = createMockContext();
    const next = { handle: () => of('data') };

    interceptor.intercept(context, next).subscribe((value) => {
      expect(value).toBe('data');
      done();
    });
  });

  it('should log method, url, status code and duration', (done) => {
    const { context } = createMockContext();
    const next = { handle: () => of('data') };

    interceptor.intercept(context, next).subscribe(() => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockLogger.log).toHaveBeenCalledTimes(1);
      const logMessage = mockLogger.log.mock.calls[0][0] as string;
      expect(logMessage).toContain('GET');
      expect(logMessage).toContain('/api/v1/test');
      expect(logMessage).toContain('200');
      expect(logMessage).toMatch(/\d+ms/);
      expect(mockLogger.log.mock.calls[0][1]).toBe('Http');
      done();
    });
  });

  it('should set X-Response-Time header on the response', (done) => {
    const { context, res } = createMockContext();
    const next = { handle: () => of('data') };

    interceptor.intercept(context, next).subscribe(() => {
      expect(res.header).toHaveBeenCalledWith('X-Response-Time', expect.stringMatching(/^\d+ms$/));
      done();
    });
  });

  it('should report duration >= 0ms', (done) => {
    const { context, res } = createMockContext();
    const next = { handle: () => of('data') };

    interceptor.intercept(context, next).subscribe(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const headerValue = res.header.mock.calls[0][1] as string;
      const ms = parseInt(headerValue.replace('ms', ''), 10);
      expect(ms).toBeGreaterThanOrEqual(0);
      done();
    });
  });
});
