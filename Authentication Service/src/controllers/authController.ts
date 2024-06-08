import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { JWTUtils, ACCESS_TOKEN_SECRET } from '../utils/jwtUtils';
import jwt from 'jsonwebtoken';

export class AuthController {
    static async createAccount(req: Request, res: Response) {
        const { password, email } = req.body;
        try {
            const user = await AuthService.createAccount(
                password,
                email
            );
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        try {
            const tokens = await AuthService.loginUser(
                username,
                password
            );
            res.status(200).json(tokens);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getUserInfo(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res
                .status(401)
                .json({ error: 'No token provided' });

        const token = authHeader.split(' ')[1];
        const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
        res.status(200).json(user);
    }

    static async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;
        try {
            const tokens = await JWTUtils.refreshToken(refreshToken);
            res.status(200).json(tokens);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getJWKS(req: Request, res: Response) {
        const jwks = await JWTUtils.getJWKS();
        res.status(200).json(jwks);
    }
}
