import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { redisClient } from '../configs/redis';
import fs from 'fs';
import path from 'path';
import jose from 'node-jose';

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Load RSA keys
const privateKey = fs.readFileSync(
    path.resolve(__dirname, '../../keys/private.pem'),
    'utf8'
);
const publicKey = fs.readFileSync(
    path.resolve(__dirname, '../../keys/public.pem'),
    'utf8'
);

export const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET ?? 'accessSecret';
export const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET ?? 'refreshSecret';
export const ID_TOKEN_SECRET =
    process.env.ID_TOKEN_SECRET ?? privateKey;

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
            ID_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
    }

    static async storeRefreshToken(userId: string, token: string) {
        await setAsync(userId, token);
    }

    static async refreshToken(refreshToken: string) {
        try {
            const payload = jwt.verify(
                refreshToken,
                REFRESH_TOKEN_SECRET
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
                idToken: this.generateIdToken(payload),
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    static async getJWKS() {
        const key = await jose.JWK.asKey(publicKey, 'pem');
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
