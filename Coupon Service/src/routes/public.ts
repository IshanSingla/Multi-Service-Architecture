import { Router } from 'express';
import CouponController from '../controllers/CouponController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get(
    '/get',
    authMiddleware,
    CouponController.getApplicableCoupons
);

router.get(
    '/validate',
    authMiddleware,
    CouponController.validateCoupon
);

export default router;
