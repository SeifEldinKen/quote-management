// import { Role } from '@prisma/client';
import { Role } from '@prisma/client';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]).default('development'),
  DEBUG: z.boolean().default(false),
  HTTP_PORT: z.number().positive().default(4618),
  HTTP_HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  PASSWORD_SALT_ROUNDS: z.number().positive().default(10),
  ACCESS_TOKEN_SECRET: z.string().uuid(),
  REFRESH_TOKEN_SECRET: z.string().uuid(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().uuid(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().uuid(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.number().positive(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof EnvSchema> {
      //
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}
