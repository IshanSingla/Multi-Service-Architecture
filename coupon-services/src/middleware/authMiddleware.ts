import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import ForeignService from '../services/ForeignService';
import { userIDSchema, authHeaderSchema } from '../DTO';
import { zodErrorHandler } from '../DTO';

export const authMiddleware = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const validation = authHeaderSchema.safeParse(req.headers);
        if (validation.error?.message) {
            res.status(401);
            throw new Error('No token provided');
        } else {
            const token =
                validation.data?.authorization?.split(' ')[1];
            const jwks = await ForeignService.getJWKS();
            const jwk = jwks.keys[0];
            const pem = jwkToPem(jwk);
            const payload: any = jwt.verify(token ?? '', pem, {
                algorithms: ['RS256'],
            });
            req.user = payload;
            next();
        }
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};

export const userIdMiddleware = (
    req: any,
    res: Response,
    next: NextFunction
): void => {
    const userId: string = req.headers['x-user-id'] as string;
    const validation = userIDSchema.safeParse({ userId });
    if (!validation.success) {
        res.status(400);
        throw new Error(zodErrorHandler(validation.error.message));
    }

    req.user = { id: userId }; // Attach the user ID to the request object
    next();
};
