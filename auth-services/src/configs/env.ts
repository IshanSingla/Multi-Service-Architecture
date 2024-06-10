import { z } from 'zod';
import fs from 'fs';
import path from 'path';

try {
    process.loadEnvFile(); // works with only latest node versions
} catch {
    require('dotenv').config();
}

const EnvSchema = z.object({
    DATABASE_URL: z
        .string({
            description: 'PostgraSQL Connection string',
            required_error: '😱 You forgot to add a database URL',
        })
        .url()
        .min(3),
    NODE_ENV: z
        .enum(['development', 'test', 'production'], {
            description:
                'This gets updated depending on your environment',
        })
        .default('development'),
    PORT: z.coerce
        .number({
            description:
                '.env files convert numbers to strings, therefoore we have to enforce them to be numbers',
        })
        .positive()
        .max(65536, `options.port should be >= 0 and < 65536`)
        .default(3000),
    REDIS_HOST: z.string({
        description: 'Redis host',
    }),
    REDIS_PASSWORD: z.string({
        description: 'Redis password',
    }),
    ACCESS_TOKEN_SECRET: z
        .string({
            description: 'Access token secret',
        })
        .default('access_secret'),
    REFRESH_TOKEN_SECRET: z
        .string({
            description: 'Refresh token secret',
        })
        .default('refresh_secret'),
    PRIVATE_KEY: z
        .string({
            description: 'Private key for Id token JWKS',
        })
        .default(
            fs.readFileSync(
                path.resolve(__dirname, '../../keys/private.pem'),
                'utf8'
            )
        ),
    PUBLIC_KEY: z
        .string({
            description: 'Public key for Id token JWKS',
        })
        .default(
            fs.readFileSync(
                path.resolve(__dirname, '../../keys/public.pem'),
                'utf8'
            )
        ),
});

export const env = EnvSchema.parse(process.env);
