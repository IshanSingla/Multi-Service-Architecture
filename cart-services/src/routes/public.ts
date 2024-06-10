import { Router } from 'express';
import CartController from '../controllers/CartController';
import {
    authMiddleware,
} from '../middleware/authMiddleware';
import { AsyncHandler } from '../middleware';

const router: Router = Router();

router.get(
    '/get',
    authMiddleware,
    AsyncHandler(CartController.getCartItems)
);
router.post(
    '/add',
    authMiddleware,
    AsyncHandler(CartController.addToCart)
);
router.post(
    '/remove',
    authMiddleware,
    AsyncHandler(CartController.removeFromCart)
);
export default router;
