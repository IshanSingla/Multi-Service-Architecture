import { NextFunction, Request, Response } from 'express';
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
    }
    res.status(statusCode).send(err.message);
}
