import { Router } from 'express';
import { userIdMiddleware } from '../middleware/authMiddleware';
import { AsyncHandler } from '../middleware';
import CouponController from '../controllers/CouponController';

const router: Router = Router();

router.post(
    '/create',
    userIdMiddleware,
    AsyncHandler(CouponController.createCoupon)
);

router.get(
    '/get',
    userIdMiddleware,
    AsyncHandler(CouponController.getApplicableCoupons)
);

router.get(
    '/validate',
    userIdMiddleware,
    AsyncHandler(CouponController.validateCoupon)
);

export default router;
