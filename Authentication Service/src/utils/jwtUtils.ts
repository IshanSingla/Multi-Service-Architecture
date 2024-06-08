import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { redisClient } from '../configs/redis';

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

export const JWT_SECRET = process.env.JWT_SECRET;

export class JWTUtils {
    static generateAccessToken(user: any) {
        return jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '15m' }
        );
    }

    static generateRefreshToken(user: any) {
        return jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    static async storeRefreshToken(userId: string, token: string) {
        await setAsync(userId, token);
    }

    static async refreshToken(refreshToken: string) {
        try {
            const payload = jwt.verify(
                refreshToken,
                JWT_SECRET
            ) as any;
            const storedToken = await getAsync(payload.id);
            if (storedToken !== refreshToken)
                throw new Error('Invalid refresh token');

            const newAccessToken = this.generateAccessToken(payload);
            const newRefreshToken =
                this.generateRefreshToken(payload);

            await this.storeRefreshToken(payload.id, newRefreshToken);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    static getJWKS() {
        // Return public keys for JWT verification
        return {
            keys: [
                /* public keys */
            ],
        };
    }
}
