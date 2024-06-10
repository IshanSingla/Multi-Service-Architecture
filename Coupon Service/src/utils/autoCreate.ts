import { prisma } from '../configs/prisma';

const predefinedCoupons = [
    {
        description: 'Order Number Wise Coupon',
        discountValue: 10,
        discountType: 'PERCENTAGE',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        orderNumber: 'ORDER123',
        applicableDays: 'ALL_DAYS',
    },
    {
        description: 'Payment Method Wise Coupon',
        discountValue: 15,
        discountType: 'FIXED_AMOUNT',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        paymentMethod: 'CREDIT_CARD',
        applicableDays: 'ALL_DAYS',
    },
    {
        description: 'Personal Coupon',
        discountValue: 20,
        discountType: 'PERCENTAGE',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        userId: 'USER123',
        applicableDays: 'ALL_DAYS',
    },
    {
        description: 'Particular Item Coupon',
        discountValue: 5,
        discountType: 'FIXED_AMOUNT',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        productId: 'PRODUCT123',
        applicableDays: 'ALL_DAYS',
    },
    {
        description: 'Category Wise Coupon',
        discountValue: 10,
        discountType: 'PERCENTAGE',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        categoryId: 'CATEGORY123',
        applicableDays: 'ALL_DAYS',
    },
    {
        description: 'Special Day Coupon',
        discountValue: 25,
        discountType: 'PERCENTAGE',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        specialDay: new Date('2024-12-25'),
        applicableDays: 'ALL_DAYS',
    },
    {
        description: 'Weekend Coupon',
        discountValue: 10,
        discountType: 'PERCENTAGE',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        applicableDays: 'WEEKEND',
    },
    {
        description: 'Weekday Coupon',
        discountValue: 5,
        discountType: 'FIXED_AMOUNT',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        applicableDays: 'WEEKDAY',
    },
];

export async function initializeCoupons() {
    for (const couponData of predefinedCoupons) {
        const existingCoupon = await prisma.coupon.findFirst({
            where: { description: couponData.description },
        });

        if (!existingCoupon) {
            await prisma.coupon.create({
                data: {
                    description: couponData.description,
                    discountValue: couponData.discountValue,
                    discountType: couponData.discountType as any,
                    validFrom: couponData.validFrom,
                    validUntil: couponData.validUntil,
                    orderNumber: couponData.orderNumber,
                    paymentMethod: couponData.paymentMethod as any,
                    userId: couponData.userId,
                    productId: couponData.productId,
                    applicableDays: couponData.applicableDays as any,

                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        }
    }
}
