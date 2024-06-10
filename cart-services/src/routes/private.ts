import { Router } from 'express';
import CartController from '../controllers/CartController';
import { userIdMiddleware } from '../middleware/authMiddleware';
import { AsyncHandler } from '../middleware';

const router: Router = Router();

// Private Routes
router.get(
    '/get',
    userIdMiddleware,
    AsyncHandler(CartController.getUserCart)
);
router.post(
    '/empty',
    userIdMiddleware,
    AsyncHandler(CartController.emptyCart)
);

export default router;
