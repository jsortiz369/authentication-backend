import path from 'node:path';
import { defineConfig } from 'prisma/config';

import { EnvZodAdapter } from './src/shared/env/adapters/env-zod.adapter';

const baseUrl = new EnvZodAdapter().baseUrl;
process.env.DATABASE_URL = baseUrl;

export default defineConfig({
  schema: path.join(process.cwd(), 'prisma'),
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: baseUrl,
  },
});
