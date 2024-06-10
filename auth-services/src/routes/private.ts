import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AsyncHandler } from '../middleware';
const privateRouter: Router = Router();

privateRouter.get('/jwks.json', AsyncHandler(AuthController.getJWKS));

export default privateRouter;
