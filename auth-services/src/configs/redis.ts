import { createClient } from 'redis';

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

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
