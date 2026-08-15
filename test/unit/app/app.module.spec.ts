jest.unmock('@nestjs/common');
jest.unmock('@nestjs/core');

import { Test, TestingModule } from '@nestjs/testing';

import { HttpExceptionFilter } from 'src/app/exception-filter/http-exception.filter';
import { ResponseTimeInterceptor, RequestAgentInterceptor } from 'src/app/interceptors';
import { LoggerRepository } from 'src/shared/logger/ports/logger.repository';

// We test providers in isolation without spinning up the full module graph
// (which would require Postgres, Redis, etc.)

const mockLogger: Partial<LoggerRepository> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

describe('AppModule - Providers', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: LoggerRepository, useValue: mockLogger },
        {
          provide: HttpExceptionFilter,
          useFactory: (logger: LoggerRepository) => new HttpExceptionFilter(logger),
          inject: [LoggerRepository],
        },
        {
          provide: ResponseTimeInterceptor,
          useFactory: (logger: LoggerRepository) => new ResponseTimeInterceptor(logger),
          inject: [LoggerRepository],
        },
        {
          provide: RequestAgentInterceptor,
          useFactory: () => new RequestAgentInterceptor(),
        },
      ],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should resolve HttpExceptionFilter', () => {
    const filter = module.get(HttpExceptionFilter);
    expect(filter).toBeDefined();
    expect(filter).toBeInstanceOf(HttpExceptionFilter);
  });

  it('should resolve ResponseTimeInterceptor', () => {
    const interceptor = module.get(ResponseTimeInterceptor);
    expect(interceptor).toBeDefined();
    expect(interceptor).toBeInstanceOf(ResponseTimeInterceptor);
  });

  it('should resolve RequestAgentInterceptor', () => {
    const interceptor = module.get(RequestAgentInterceptor);
    expect(interceptor).toBeDefined();
    expect(interceptor).toBeInstanceOf(RequestAgentInterceptor);
  });
});
