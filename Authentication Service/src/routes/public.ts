import { Router } from 'express';
import { AuthController } from '../controllers/authController';
const publicRouter: Router = Router();

publicRouter.post('/create', AuthController.createAccount);
publicRouter.post('/login', AuthController.loginUser);
publicRouter.get('/check', AuthController.getUserInfo);
publicRouter.post('/token', AuthController.refreshToken);

export default publicRouter;
