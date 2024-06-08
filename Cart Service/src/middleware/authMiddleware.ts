import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import ForeignService from '../services/ForeignService';

export const authMiddleware = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
        } else {
            const decodedToken: any = jwt.decode(token, {
                complete: true,
            });
            const jwks = await ForeignService.getJWKS();
            const jwk = jwks.keys[0];
            const pem = jwkToPem(jwk);
            const payload: any = jwt.verify(token, pem, {
                algorithms: ['RS256'],
            });
            req.user = payload;
            next();
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Failed to authenticate' });
    }
};

export const userIdMiddleware = (
    req: any,
    res: Response,
    next: NextFunction
): void => {
    const userId: string = req.headers['x-user-id'] as string;
    if (!userId) {
        res.status(400).json({ error: 'No user ID provided' });
    } else {
        req.user = { id: userId }; // Attach the user ID to the request object
        next();
    }
};
