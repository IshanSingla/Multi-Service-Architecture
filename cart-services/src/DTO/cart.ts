import { z } from 'zod';

// Reusable schemas for productId and userId
export const productIDSchema = z.object({
    productId: z
        .string({
            message: 'Product ID must be a string',
            required_error: 'Product ID is required',
        })
        .uuid({
            message: 'Product ID must be a valid UUID',
        }),
});

// Schema for product with quantity
export const AddSchema = z.object({
    productId: z
        .string({
            message: 'Product ID must be a string',
            required_error: 'Product ID is required',
        })
        .uuid({
            message: 'Product ID must be a valid UUID',
        }),
    quantity: z
        .number({
            message: 'Quantity must be a number',
            required_error: 'Quantity is required',
        })
        .int({
            message: 'Quantity must be an integer',
        }),
});
