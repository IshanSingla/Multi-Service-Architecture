import { NextFunction, Request, Response } from 'express';
import CouponService from '../services/CouponService';

class CouponController {
    static async createCoupon(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const coupon = await CouponService.createCoupon(req.body);
            res.status(201).json(coupon);
        } catch (error) {
            next(error);
        }
    }

    static async getApplicableCoupons(
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const coupons = await CouponService.getApplicableCoupons(
                req.user.id
            );
            res.status(200).json(coupons);
        } catch (error) {
            next(error);
        }
    }

    static async validateCoupon(
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { couponId, paymentMethod } = req.params;
            const isValid = await CouponService.validateCoupon(
                req.user.id,
                couponId,
                paymentMethod
            );
            res.status(200).json({ isValid });
        } catch (error) {
            next(error);
        }
    }
}

export default CouponController;
