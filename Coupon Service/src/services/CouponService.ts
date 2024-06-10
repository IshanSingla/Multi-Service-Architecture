import { Coupon } from '@prisma/client';
import ForeignService from './ForeignService';
import { prisma } from '../configs/prisma';

class CouponService {
    static async createCoupon(couponData: Coupon) {
        try {
            return await prisma.coupon.create({ data: couponData });
        } catch (error) {
            throw new Error('Failed to create coupon');
        }
    }

    static async getApplicableCoupons(userId: string) {
        try {
            const cart: {
                items: { productId: string; quantity: number }[];
            } = await ForeignService.getCartofUser(userId);
            const currentDate = new Date();
            const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
            const isWeekend = currentDay === 0 || currentDay === 6;
            const isWeekday = !isWeekend;

            // Fetch all coupons
            const allCoupons = await prisma.coupon.findMany();

            // Filter coupons based on various conditions
            const applicableCoupons = allCoupons.filter((coupon) => {
                // Check date range validity
                if (
                    coupon.validFrom > currentDate ||
                    coupon.validUntil < currentDate
                ) {
                    return false;
                }

                // Check user-specific coupons
                if (coupon.userId && coupon.userId !== userId) {
                    return false;
                }

                // Check payment method specific coupons
                if (coupon.paymentMethod) {
                    return true;
                }

                // Check product-specific coupons
                if (
                    coupon.productId &&
                    !cart.items.some(
                        (item) => item.productId === coupon.productId
                    )
                ) {
                    return false;
                }

                // Check special day coupons
                if (
                    coupon.specialDay &&
                    coupon.specialDay.toDateString() !==
                        currentDate.toDateString()
                ) {
                    return false;
                }

                // Check applicable days coupons
                if (
                    (coupon.applicableDays === 'WEEKDAY' &&
                        !isWeekday) ||
                    (coupon.applicableDays === 'WEEKEND' &&
                        !isWeekend)
                ) {
                    return false;
                }

                // Check minimum order value
                if (coupon.minOrderValue) {
                    return true;
                }

                return true;
            });

            return applicableCoupons;
        } catch (error) {
            throw new Error('Failed to fetch applicable coupons');
        }
    }

    static async validateCoupon(
        userId: string,
        couponId: string,
        paymentMethod: string
    ): Promise<boolean> {
        try {
            const coupon = await prisma.coupon.findUnique({
                where: { id: couponId },
            });
            if (!coupon) {
                throw new Error('Coupon not found');
            }

            const currentDate = new Date();
            const cart: {
                items: { productId: string; quantity: number }[];
            } = await ForeignService.getCartofUser(userId);

            // Check date range validity
            if (
                coupon.validFrom > currentDate ||
                coupon.validUntil < currentDate
            ) {
                return false;
            }

            // Check user-specific coupons
            if (coupon.userId && coupon.userId !== userId) {
                return false;
            }

            // Check payment method specific coupons
            if (
                coupon.paymentMethod &&
                coupon.paymentMethod !== paymentMethod
            ) {
                return false;
            }

            // Check product-specific coupons
            if (
                coupon.productId &&
                !cart.items.some(
                    (item) => item.productId === coupon.productId
                )
            ) {
                return false;
            }

            // Check special day coupons
            if (
                coupon.specialDay &&
                coupon.specialDay.toDateString() !==
                    currentDate.toDateString()
            ) {
                return false;
            }

            // Check applicable days coupons
            const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
            const isWeekend = currentDay === 0 || currentDay === 6;
            const isWeekday = !isWeekend;

            if (
                (coupon.applicableDays === 'WEEKDAY' && !isWeekday) ||
                (coupon.applicableDays === 'WEEKEND' && !isWeekend)
            ) {
                return false;
            }

            return true;
        } catch (error) {
            throw new Error('Failed to validate coupon');
        }
    }
}

export default CouponService;
