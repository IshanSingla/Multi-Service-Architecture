import { z } from 'zod';

//Define the schema for the authorization header
export const authHeaderSchema = z.object({
    authorization: z
        .string()
        .refine((val) => val.startsWith('Bearer '), {
            message: 'Bearer token required',
        }),
});
