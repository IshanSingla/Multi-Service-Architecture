import { Router } from 'express';
import CartController from '../controllers/CartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

router.get('/get', authMiddleware, CartController.getCartItems);
router.post('/add', authMiddleware, CartController.addToCart);
router.post('/remove', authMiddleware, CartController.removeFromCart);
export default router;
