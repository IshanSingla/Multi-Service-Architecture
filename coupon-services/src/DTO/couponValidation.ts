// schemas/authSchemas.ts
import { z } from 'zod';

export const validateCouponSchema = z.object({
    code: z.string({
        message: "Coupon Code cannot be empty",
        required_error: "Coupon Code is required"
    }
    ),
    paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "CASH_ON_DELIVERY", "BANK_TRANSFER"], {
        required_error: "Payment method is required",
        message: "Payment method is Invalid"
    })
});



// Enums
const DiscountType = z.enum(["PERCENTAGE", "FIXED_AMOUNT"]);
const PaymentMethod = z.enum(["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "CASH_ON_DELIVERY", "BANK_TRANSFER"]);
const ApplicableDays = z.enum(["WEEKDAY", "WEEKEND", "ALL_DAYS"]);

// Coupon Schema
export const CouponSchema = z.object({
    code: z.string({ message: "Code cannot be empty" }),
    description: z.string({ message: "Description cannot be empty" }),
    discountValue: z.number({ message: "Discount value must be a number" }),
    discountType: DiscountType,
    validFrom: z.date({ message: "Valid from must be a date" }),
    validUntil: z.date({ message: "Valid until must be a date" }),
    minOrderValue: z.number({ message: "Minimum order value must be a number" }).optional(),
    maxDiscountValue: z.number({ message: "Maximum discount value must be a number" }).optional(),
    orderNumber: z.string({ message: "Order number must be a string" }).optional(),
    paymentMethod: PaymentMethod.optional(),
    userId: z.string({ message: "User ID must be a string" }).optional(),
    productId: z.string({ message: "Product ID must be a string" }).optional(),
    categoryId: z.string({ message: "Category ID must be a string" }).optional(),
    specialDay: z.date({ message: "Special day must be a date" }).optional(),
    applicableDays: ApplicableDays,
    createdAt: z.date({ message: "Created at must be a date" }).default(() => new Date()), // Defaults to the current date
    updatedAt: z.date({ message: "Updated at must be a date" }).optional(), // Handled by Prisma
});


