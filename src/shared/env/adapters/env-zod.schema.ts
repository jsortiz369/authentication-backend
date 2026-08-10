import { randomBytes } from 'crypto';
import z from 'zod';

import { Env, EnvJwtExpiresIn } from '../ports/env.interface';

const unit = '(Years?|Yrs?|Y|Weeks?|W|Days?|D|Hours?|Hrs?|Hr|H|Minutes?|Mins?|Min|M|Seconds?|Secs?|Sec|s|Milliseconds?|Msecs?|Msec|Ms)';
const jwtExpiration = z.custom<EnvJwtExpiresIn>((val) => typeof val === 'string' && new RegExp(`^\\d+(?:\\s?${unit})?$`, 'i').test(val), {
  message: 'EXPIRES_IN is not valid',
});
const validateNumber = (val: string) => (typeof val === 'string' && /^[0-9]+$/.test(val) ? Number(val) : val);

const stringRequired = (field: string) =>
  z
    .string({ error: `${field} must be a string` })
    .nonempty({ message: `${field} is no empty` })
    .nonoptional({ message: `${field} is required` });

const portRequired = (field: string) =>
  z.preprocess(
    validateNumber,
    z
      .number({ error: `${field} must be a number` })
      .min(1000, { message: `${field} must be greater than 1000` })
      .max(65535, { message: `${field} must be less than 65535` }),
  );

export const envZodSchema: z.ZodType<Env> = z
  .object(
    {
      NODE_ENV: z
        .enum(['development', 'production', 'test'], { error: `NODE_ENV must be a 'development' | 'production' | 'test'` })
        .default('development'),
      PORT: portRequired('PORT'),
      SECRET_COOKIE: z.string({ error: 'SECRET_COOKIE must be a string' }).default(() => randomBytes(64).toString('hex')),
      APP_URL: stringRequired('APP_URL'),
      DB_HOST: stringRequired('DB_HOST'),
      DB_NAME: stringRequired('DB_NAME'),
      DB_USERNAME: stringRequired('DB_USERNAME'),
      DB_PASSWORD: stringRequired('DB_PASSWORD'),
      DB_PORT: portRequired('DB_PORT'),
      JWT_SECRET: stringRequired('JWT_SECRET'),
      JWT_REFRESH_SECRET: stringRequired('JWT_REFRESH_SECRET'),
      JWT_CONFIRM_SECRET: stringRequired('JWT_CONFIRM_SECRET'),
      JWT_EXPIRES_IN: z
        .union([jwtExpiration, z.number({ error: 'JWT_EXPIRES_IN must be a number' })], {
          error: 'JWT_EXPIRES_IN must be a string or a number',
        })
        .nonoptional({ message: 'JWT_EXPIRES_IN is required' }),
      JWT_REFRESH_EXPIRES_IN: z
        .union([jwtExpiration, z.number({ error: 'JWT_REFRESH_EXPIRES_IN must be a number' })], {
          error: 'JWT_REFRESH_EXPIRES_IN must be a string or a number',
        })
        .nonoptional({ message: 'JWT_REFRESH_EXPIRES_IN is required' }),
      REDIS_HOST: stringRequired('REDIS_HOST'),
      REDIS_PORT: portRequired('REDIS_PORT'),
      REDIS_PASSWORD: z.string({ error: 'REDIS_PASSWORD must be a string' }).optional(),
      SMTP_HOST: stringRequired('SMTP_HOST'),
      SMTP_PORT: portRequired('SMTP_PORT'),
      SMTP_USERNAME: stringRequired('SMTP_USERNAME'),
      SMTP_PASSWORD: stringRequired('SMTP_PASSWORD'),
      SMTP_TLS: z.preprocess(
        (val) => (val === 'true' || val === true ? true : val === 'false' || val === false ? false : val),
        z.boolean({ error: 'SMTP_TLS must be a boolean (true | false)' }).default(false),
      ),
    },
    {
      error: `it doesn't meet the environment variables scheme`,
    },
  )
  .strict();
