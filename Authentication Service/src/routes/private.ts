import { Router } from 'express';
import { AuthController } from '../controllers/authController';
const privateRouter: Router = Router();

privateRouter.get('/jwks.json', AuthController.getJWKS);

export default privateRouter;
