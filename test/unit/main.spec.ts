jest.mock('src/app/app.module', () => ({ AppModule: class AppModule {} }));
jest.mock('src/shared/env/ports/env.repository', () => ({ EnvRepository: class EnvRepository {} }));
jest.mock('src/shared/logger/ports/logger.repository', () => ({ LoggerRepository: class LoggerRepository {} }));
jest.mock('src/app/exception-filter/http-exception.filter', () => ({ HttpExceptionFilter: class HttpExceptionFilter {} }));
jest.mock('src/app/interceptors', () => ({
  ResponseTimeInterceptor: class ResponseTimeInterceptor {},
  RequestAgentInterceptor: class RequestAgentInterceptor {},
}));
jest.mock('src/app/constants/const.constant', () => ({ CONSTANTS: { cookies: { account_confirm: 'account_confirmed' } } }));
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.unmock('@nestjs/common');

import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app/app.module';
import { bootstrap } from 'src/main';
import { mockEnv, mockLogger } from './helpers/mocks';

describe('bootstrap (main.ts)', () => {
  const mockResponseTimeInterceptor = { intercept: jest.fn() };
  const mockRequestAgentInterceptor = { intercept: jest.fn() };
  const mockHttpExceptionFilter = { catch: jest.fn() };

  const mockApp = {
    get: jest.fn().mockImplementation((token: new () => unknown) => {
      const name = token?.name ?? '';
      if (name === 'EnvRepository') return mockEnv;
      if (name === 'LoggerRepository') return mockLogger;
      if (name === 'ResponseTimeInterceptor') return mockResponseTimeInterceptor;
      if (name === 'RequestAgentInterceptor') return mockRequestAgentInterceptor;
      if (name === 'HttpExceptionFilter') return mockHttpExceptionFilter;
      return {};
    }),
    useGlobalFilters: jest.fn(),
    useGlobalInterceptors: jest.fn(),
    setGlobalPrefix: jest.fn(),
    useGlobalPipes: jest.fn(),
    enableCors: jest.fn(),
    register: jest.fn().mockResolvedValue(undefined),
    use: jest.fn(),
    listen: jest.fn().mockImplementation((_port: unknown, _host: unknown, cb?: () => void) => {
      if (cb) cb();
      return Promise.resolve();
    }),
    getUrl: jest.fn().mockResolvedValue('http://localhost:8000'),
  };

  beforeAll(() => {
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should create the NestJS app with FastifyAdapter', async () => {
    await bootstrap();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule, expect.anything());
  });

  it('should use global interceptors', async () => {
    await bootstrap();

    expect(mockApp.useGlobalInterceptors).toHaveBeenCalledTimes(2);
    expect(mockApp.useGlobalInterceptors).toHaveBeenCalledWith(mockResponseTimeInterceptor);
    expect(mockApp.useGlobalInterceptors).toHaveBeenCalledWith(mockRequestAgentInterceptor);
    expect(mockApp.useGlobalInterceptors).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        intercept: expect.any(Function),
      }),
    );
  });

  it('should use global filters', async () => {
    await bootstrap();

    expect(mockApp.useGlobalFilters).toHaveBeenCalledTimes(1);
    expect(mockApp.useGlobalFilters).toHaveBeenCalledWith(mockHttpExceptionFilter);
    expect(mockApp.useGlobalFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        catch: expect.any(Function),
      }),
    );
  });

  it('should set global prefix to api/v1', async () => {
    await bootstrap();
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
  });

  it('should use global pipes', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(1);

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        errorHttpStatusCode: 400,
        isTransformEnabled: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        validatorOptions: expect.objectContaining({
          forbidNonWhitelisted: true,
          whitelist: true,
        }),
      }),
    );
  });

  it('should enable cors', async () => {
    await bootstrap();

    expect(mockApp.enableCors).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        origin: expect.arrayContaining([]),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        methods: expect.arrayContaining(['GET', 'POST', 'PATCH', 'PUT', 'DELETE']),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        allowedHeaders: expect.arrayContaining(['Content-Type']),
        credentials: true,
      }),
    );
  });

  it('should register the cookie plugin with httpOnly and sameSite:lax', async () => {
    await bootstrap();

    expect(mockApp.register).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        secret: expect.any(String),
        parseOptions: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
      }),
    );
  });

  it('should mount the API reference at /docs', async () => {
    await bootstrap();
    expect(mockApp.use).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion,@typescript-eslint/no-unsafe-member-access
    expect((mockApp.use as jest.Mock).mock.calls[0][0]).toBe('/docs');
  });

  it('should listen', async () => {
    await bootstrap();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const [port, host] = (mockApp.listen as jest.Mock).mock.calls[0] as [number, string];
    expect(port).toBe(8000);
    expect(host).toBe('0.0.0.0');
  });
});
