import { z } from 'zod';
import dotenv from 'dotenv';

// Load variables from .env file into process.env
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

// Parse and validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:\n', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
