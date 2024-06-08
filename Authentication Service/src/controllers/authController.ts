import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { JWTUtils } from '../utils/jwtUtils';
import { CustomRequest } from '../types';

export class AuthController {
    static async createAccount(req: Request, res: Response) {
        const { username, password, email } = req.body;
        try {
            const user = await AuthService.createAccount(
                username,
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

    static async getUserInfo(req: CustomRequest, res: Response) {
        const user = req.user;
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
        const jwks = JWTUtils.getJWKS();
        res.status(200).json(jwks);
    }
}
