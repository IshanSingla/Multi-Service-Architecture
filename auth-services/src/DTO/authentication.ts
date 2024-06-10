// schemas/authSchemas.ts
import { z } from 'zod';

// Define a schema for user registration
export const authSchemas = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});