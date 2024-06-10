import { z } from 'zod';



export function zodErrorHandler(errStr: string) {
    return JSON.parse(errStr)
        .map((e: any) => e.message)
        .join(' ');
}
//Define the schema for the authorization header
export const authHeaderSchema = z.object({
    authorization: z
        .string()
        .refine((val) => val.startsWith('Bearer '), {
            message: 'Bearer token required',
        }),
});

export const userIDSchema = z.object({
    userId: z
        .string({
            message: 'User ID must be a string',
            required_error: 'User ID is required',
        })
        .uuid({
            message: 'User ID must be a valid UUID',
        }),
});
