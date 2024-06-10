import { NextFunction, Request, Response } from 'express';
import CouponService from '../services/CouponService';
import { validateCouponSchema } from '../DTO/couponValidation';
import { userIDSchema } from '../DTO';
import { prisma } from '../configs/prisma';
import ForeignService from '../services/ForeignService';


function errorHandler(errStr: string) {
    return JSON.parse(errStr).map((e: any) => e.message).join(" ")
}

class CouponController {
    static async createCoupon(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // const validation = validateCouponSchema.safeParse(req.body)
            // if (!validation.success) {
            //     res.status(400);
            //     console.log(validation.error.message)
            //     throw new Error(errorHandler(validation.error.message))
            // }


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
            const validation = userIDSchema.safeParse({ userId: req.user.id })
            if (!validation.success) {
                res.status(400);
                throw new Error(errorHandler(validation.error.message))
            }
            const coupons = await CouponService.getApplicableCoupons(
                validation.data.userId
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
            const validation = validateCouponSchema.safeParse(req.query)
            if (!validation.success) {
                res.status(400);
                throw new Error(errorHandler(validation.error.message))
            }
            const { code, paymentMethod } = validation.data;

            const coupon = await prisma.coupon.findUnique({
                where: { code },
            });
            if (!coupon) {
                res.status(404)
                throw new Error('Coupon not found');
            }


            const cart: { productId: string; quantity: number }[] = await ForeignService.getCartofUser(req.user.id);



            const isValid = await CouponService.validateCoupon(
                req.user.id,
                coupon,
                paymentMethod,
                cart

            );
            res.status(200).json({ isValid });
        } catch (error: any) {
            if (error?.message === 'Failed to fetch cart')
                res.status(404)
            next(error);
        }
    }
}

export default CouponController;
