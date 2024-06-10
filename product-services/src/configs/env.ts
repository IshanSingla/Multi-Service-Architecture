import { z } from 'zod';

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
});

export const env = EnvSchema.parse(process.env);
