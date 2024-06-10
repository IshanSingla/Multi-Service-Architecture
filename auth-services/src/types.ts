import { User } from '@prisma/client';
import { Request, Response } from 'express';

export type CustomRequest = Request & {
    user: User;
};
