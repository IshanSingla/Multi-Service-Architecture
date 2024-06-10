import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { JWTUtils, ACCESS_TOKEN_SECRET } from '../utils/jwtUtils';
import { authSchemas } from '../DTO/authentication';
import jwt from 'jsonwebtoken';
import { authHeaderSchema } from '../DTO';

function errorHandler(errStr: string) {
    return JSON.parse(errStr)
        .map((e: any) => e.message)
        .join(' ');
}
export class AuthController {
    static async createAccount(req: Request, res: Response) {
        const validation = authSchemas.safeParse(req.body);
        if (!validation.success) {
            res.status(400);
            throw new Error(errorHandler(validation.error.message));
        }
        const { password, email } = validation.data;
        const user = await AuthService.createAccount(password, email);
        res.status(201).json(user);
    }

    static async loginUser(req: Request, res: Response) {
        const validation = authSchemas.safeParse(req.body);

        if (!validation.success) {
            res.status(400);
            throw new Error(errorHandler(validation.error.message));
        }
        const { email, password } = validation.data;
        const tokens = await AuthService.loginUser(email, password);
        res.status(200).json(tokens);
    }

    static async getUserInfo(req: Request, res: Response) {
        const validation = authHeaderSchema.safeParse(req.headers);

        if (!validation.success) {
            res.status(400);
            throw new Error(errorHandler(validation.error.message));
        }

        const accessToken =
            validation.data.authorization.split(' ')[1];
        const user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        res.status(200).json(user);
    }

    static async refreshToken(req: Request, res: Response) {
        const validation = authHeaderSchema.safeParse(req.headers);

        if (!validation.success) {
            res.status(400);
            throw new Error(errorHandler(validation.error.message));
        }

        const refreshToken =
            validation.data.authorization.split(' ')[1];
        const tokens = await JWTUtils.refreshToken(refreshToken);
        res.status(200).json(tokens);
    }

    static async getJWKS(req: Request, res: Response) {
        const jwks = await JWTUtils.getJWKS();
        res.status(200).json(jwks);
    }
}
