import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

import { AppModule } from './app/app.module';
import { EnvRepository } from './shared/env/ports/env.repository';
import { LoggerRepository } from './shared/logger/ports/logger.repository';
import { HttpExceptionFilter } from './app/exception-filter/http-exception.filter';
import { RequestAgentInterceptor, ResponseTimeInterceptor } from './app/interceptors';
import { CONSTANTS } from './app/constants/const.constant';

declare module 'fastify' {
  interface FastifyRequest {
    idUser?: string;
    idSession?: string;
    userAgentData: {
      browser: string | null;
      version: string | null;
      device: string;
      os: string | null;
    };
  }
}

export async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const _env$ = app.get<EnvRepository>(EnvRepository);
  const _logger$ = app.get<LoggerRepository>(LoggerRepository);

  // global filters
  app.useGlobalFilters(app.get(HttpExceptionFilter));

  // global interceptors
  app.useGlobalInterceptors(app.get(ResponseTimeInterceptor));
  app.useGlobalInterceptors(app.get(RequestAgentInterceptor));

  // global prefix
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // enable cors
  app.enableCors({
    origin: [],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });

  // cookie plugin
  await app.register(fastifyCookie, {
    secret: _env$.env('SECRET_COOKIE'),
    parseOptions: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
  });

  // swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('The authentication API description')
    .setVersion('1.0')
    .addCookieAuth(
      CONSTANTS.cookies.account_confirm,
      { type: 'apiKey', in: 'cookie', description: 'Account confirmation token' },
      CONSTANTS.cookies.account_confirm,
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  app.use(
    '/docs',
    apiReference({
      withFastify: true,
      theme: 'deepSpace',
      spec: {
        content: swaggerDocument,
      },
    }),
  );

  await app.listen(_env$.env('PORT'), '0.0.0.0', () => {
    app
      .getUrl()
      .then((url) => _logger$.log(`🚀 Application is running on: ${url}`))
      .catch((err) => _logger$.error(err));
  });
}

bootstrap().catch((err) => console.error(err));
