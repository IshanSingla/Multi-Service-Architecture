import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import ForeignService from '../services/ForeignService';
import { logger } from '../configs/logger';

export function notFound(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(404);
    const error = new Error(`404 Not Found - ${req.originalUrl}`);
    next(error);
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    if (statusCode > 404) {
        logger.error(err);
        res.status(statusCode).send('Internal Server Error');
    } else {
        res.status(statusCode).send(err.message);
    }
}
export const authMiddleware = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401);
            throw new Error('No token provided');
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
        res.status(401).send('Unauthorized');
    }
};

export const userIdMiddleware = (
    req: any,
    res: Response,
    next: NextFunction
): void => {
    const userId: string = req.headers['x-user-id'] as string;
    if (!userId) {
        res.status(400);
        throw new Error('User ID is required');
    } else {
        req.user = { id: userId }; // Attach the user ID to the request object
        next();
    }
};
