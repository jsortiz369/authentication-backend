import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { UAParser } from 'ua-parser-js';

export class RequestAgentInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    const parser = new UAParser(req.headers['user-agent']);
    const browser = parser.getBrowser();
    const device = parser.getDevice();
    const os = parser.getOS();

    req.userAgentData = {
      browser: browser.name ?? null,
      version: browser.version ?? null,
      device: device.type ?? 'Desktop',
      os: os.name ?? null,
    };

    return next.handle();
  }
}
