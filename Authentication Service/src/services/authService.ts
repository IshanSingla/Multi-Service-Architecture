import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { JWTUtils } from '../utils/jwtUtils';
import { prisma } from '../configs/prisma';

export class AuthService {
    static async createAccount(
        username: string,
        password: string,
        email: string
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                password: hashedPassword,
                email,
            },
        });
        return user;
    }

    static async loginUser(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new Error('User not found');

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) throw new Error('Invalid password');

        const accessToken = JWTUtils.generateAccessToken(user);
        const refreshToken = JWTUtils.generateRefreshToken(user);

        // Store refresh token in Redis
        await JWTUtils.storeRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }
}
