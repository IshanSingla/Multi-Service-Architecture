import redis from 'redis';

export const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('error', (err) =>
    console.error('Redis Client Error', err)
);
