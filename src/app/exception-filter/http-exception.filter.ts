import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { LoggerRepository } from 'src/shared/logger/ports/logger.repository';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly _logger$: LoggerRepository) {}

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const error: { message: string | string[] } = { message: 'error in server' };

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response: string | object = exception.getResponse();
      error.message = typeof response === 'string' ? response : (response['message'] as string[]);
    }

    this._logger$.error(`${request.method} ${request.url} ${statusCode} ${exception.message}`, exception.stack, 'HTTP');
    response.status(statusCode).send({ statusCode: statusCode, timestamp: new Date().toISOString(), error });
  }
}
