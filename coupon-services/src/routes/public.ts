import { Router } from 'express';
import CouponController from '../controllers/CouponController';
import {  authMiddleware } from '../middleware/authMiddleware';
import { AsyncHandler } from '../middleware';

const router = Router();

router.get(
    '/get',
    authMiddleware,
    AsyncHandler(CouponController.getApplicableCoupons)
);

router.get(
    '/validate',
    authMiddleware,
    AsyncHandler(CouponController.validateCoupon)
);

export default router;
