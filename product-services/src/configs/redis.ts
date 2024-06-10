import { createClient } from 'redis';
import { env } from './env';

const REDIS_HOST = env.REDIS_HOST;
const REDIS_PASSWORD = env.REDIS_PASSWORD;

export const redisClient = createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: 16369,
    },
});

redisClient.on('error', (err) =>
    console.error('Redis Client Error', err)
);
