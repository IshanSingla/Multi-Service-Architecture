import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { JWTUtils, ACCESS_TOKEN_SECRET } from '../utils/jwtUtils';
import jwt from 'jsonwebtoken';

export class AuthController {
    static async createAccount(req: Request, res: Response) {
        const { password, email } = req.body;
        const user = await AuthService.createAccount(password, email);
        res.status(201).json(user);
    }

    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body;
        const tokens = await AuthService.loginUser(email, password);
        res.status(200).json(tokens);
    }

    static async getUserInfo(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new Error('Authorization header is required');

        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
        res.status(200).json(user);
    }

    static async refreshToken(req: Request, res: Response) {
        const { refresh_token } = req.body;
        const tokens = await JWTUtils.refreshToken(refresh_token);
        res.status(200).json(tokens);
    }

    static async getJWKS(req: Request, res: Response) {
        const jwks = await JWTUtils.getJWKS();
        res.status(200).json(jwks);
    }
}
