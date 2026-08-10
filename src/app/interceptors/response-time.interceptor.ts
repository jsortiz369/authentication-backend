import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';

import { LoggerRepository } from 'src/shared/logger/ports/logger.repository';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  constructor(private readonly _logger$: LoggerRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const res = context.switchToHttp().getResponse<FastifyReply>();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this._logger$.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`, 'Http');
        res.header('X-Response-Time', `${duration}ms`);
      }),
    );
  }
}
