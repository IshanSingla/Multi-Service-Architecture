import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET } from "../utils/jwtUtils"

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res
                .status(403)
                .json({ error: 'Token is not valid' });
        req.user = user;
        next();
    });
};