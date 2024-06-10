import { Router } from 'express';
import { userIdMiddleware } from '../middleware/authMiddleware';
import CouponController from '../controllers/CouponController';

const router: Router = Router();

router.post(
    '/create',
    userIdMiddleware,
    CouponController.createCoupon
);

router.get(
    '/get',
    userIdMiddleware,
    CouponController.getApplicableCoupons
);

router.get(
    '/validate',
    userIdMiddleware,
    CouponController.validateCoupon
);

export default router;
