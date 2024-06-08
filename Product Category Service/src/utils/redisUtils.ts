import { redisClient } from '../configs/redis';

export class RedisUtils {
    static async getCache(key: string) {
        return new Promise<string | null>((resolve, reject) => {
            redisClient.get(key, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    static async setCache(key: string, value: string) {
        return new Promise<void>((resolve, reject) => {
            redisClient.set(key, value, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    static async clearCache(...keys: string[]) {
        return new Promise<void>((resolve, reject) => {
            redisClient.del(keys, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}
