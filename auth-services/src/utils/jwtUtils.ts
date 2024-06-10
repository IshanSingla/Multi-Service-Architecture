import jwt from 'jsonwebtoken';
import jose from 'node-jose';
import { env } from '../configs/env';
// import { promisify } from 'util';
// import { redisClient } from '../configs/redis';

// const getAsync = promisify(redisClient.get).bind(redisClient);
// const setAsync = promisify(redisClient.set).bind(redisClient);

export const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    PRIVATE_KEY,
    PUBLIC_KEY,
} = env;

export class JWTUtils {
    static generateAccessToken(user: any) {
        return jwt.sign(
            { id: user.id, username: user.username },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
    }

    static generateRefreshToken(user: any) {
        return jwt.sign(
            { id: user.id, username: user.username },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );
    }

    static generateIdToken(user: any) {
        return jwt.sign(
            { id: user.id, username: user.username },
            PRIVATE_KEY,
            { algorithm: 'RS256', expiresIn: '15m' } // Use RS256 for asymmetric key
        );
    }

    static async storeRefreshToken(userId: string, token: string) {
        return;
    }

    static async refreshToken(refreshToken: string) {
        try {
            const payload = jwt.verify(
                refreshToken,
                REFRESH_TOKEN_SECRET
            ) as any;
            // await redisClient.connect();
            // const storedToken = await getAsync(payload.id);
            // await redisClient.disconnect();
            // if (storedToken !== refreshToken)
            //     throw new Error('Invalid refresh token');

            const newAccessToken = this.generateAccessToken(payload);
            const newRefreshToken =
                this.generateRefreshToken(payload);

            await this.storeRefreshToken(payload.id, newRefreshToken);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                idToken: this.generateIdToken(payload),
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    static async getJWKS() {
        const key = await jose.JWK.asKey(PUBLIC_KEY, 'pem');
        const jwks: any = key.toJSON();
        return {
            keys: [
                {
                    kty: jwks.kty,
                    kid: jwks.kid,
                    use: 'sig',
                    alg: 'RS256',
                    n: jwks.n,
                    e: jwks.e,
                },
            ],
        };
    }
}
