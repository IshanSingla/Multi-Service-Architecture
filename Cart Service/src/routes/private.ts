import { Router } from 'express';
import CartController from '../controllers/CartController';
import { userIdMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

// Private Routes
router.get('/get', userIdMiddleware, CartController.getUserCart);
router.post('/empty', userIdMiddleware, CartController.emptyCart);

export default router;
