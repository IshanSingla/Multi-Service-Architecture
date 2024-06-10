// schemas/authSchemas.ts
import { z } from 'zod';



// Example of a UUID validation pattern
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;



// Define a schema for creating Category
export const authCategorySchemas = z.object({
    name: z.string().min(2, "Category must be at least 2 characters long"),
    description: z.string(),
});



//Define the schema for creating product
export const authProductSchema = z.object({
    name: z.string().nonempty("Name is required"),
    price: z.number().positive("Price must be a positive number"),
    category_id: z.string().nonempty("Category ID is required"),
    description: z.string().optional(),
});



export const authIdSchema = z.object({
    id: z.string().nonempty("Product ID is required").regex(uuidPattern, "Invalid product ID format"),
});