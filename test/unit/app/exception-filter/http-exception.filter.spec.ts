import { HttpException, HttpStatus, BadRequestException, NotFoundException, ArgumentsHost } from '@nestjs/common';

import { HttpExceptionFilter } from 'src/app/exception-filter/http-exception.filter';
import { LoggerRepository } from 'src/shared/logger/ports/logger.repository';

const mockLogger: jest.Mocked<LoggerRepository> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn() as jest.Mock<void, [{ statusCode: number; timestamp: string; error: object }]>,
};

const mockRequest = {
  method: 'GET',
  url: '/api/v1/test',
};

const createMockHost = () =>
  ({
    switchToHttp: () => ({
      getResponse: () => mockResponse,
      getRequest: () => mockRequest,
    }),
  }) as ArgumentsHost;

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter(mockLogger);
    jest.clearAllMocks();
  });

  it('should respond with 500 and generic message for unknown errors', () => {
    const error = new Error('Something broke');

    filter.catch(error, createMockHost());

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        error: { message: 'error in server' },
      }),
    );
  });

  it('should respond with the correct status code for HttpException', () => {
    const exception = new NotFoundException('Resource not found');

    filter.catch(exception, createMockHost());

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        error: { message: 'Resource not found' },
      }),
    );
  });

  it('should handle HttpException with object response (class-validator style)', () => {
    const exception = new BadRequestException({
      message: ['field must not be empty', 'field must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    });

    filter.catch(exception, createMockHost());

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        error: { message: ['field must not be empty', 'field must be a string'] },
      }),
    );
  });

  it('should include a timestamp in ISO format', () => {
    const exception = new HttpException('test', 400);

    filter.catch(exception, createMockHost());

    const body = mockResponse.send.mock.calls[0][0];
    expect(body.timestamp).toBeDefined();
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it('should log the error with method, url, status and message', () => {
    const exception = new NotFoundException('Not found');

    filter.catch(exception, createMockHost());

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('GET /api/v1/test 404'), expect.anything(), 'HTTP');
  });

  it('should log the exception stack trace', () => {
    const error = new Error('Unexpected');

    filter.catch(error, createMockHost());

    const stack = mockLogger.error.mock.calls[0][1] as string;
    expect(stack).toContain('Error: Unexpected');
  });
});
