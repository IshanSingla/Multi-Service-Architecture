import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AsyncHandler } from '../middleware';
const publicRouter: Router = Router();

publicRouter.post(
    '/create',
    AsyncHandler(AuthController.createAccount)
);
publicRouter.post('/login', AsyncHandler(AuthController.loginUser));
publicRouter.get('/check', AsyncHandler(AuthController.getUserInfo));
publicRouter.post('/token', AsyncHandler(AuthController.refreshToken));

export default publicRouter;
