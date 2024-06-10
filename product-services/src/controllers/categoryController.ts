import { NextFunction, Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { authCategorySchemas, authIdSchema } from '../DTO/authentication';





function errorHandler(errStr: string) {
    return JSON.parse(errStr).map((e: any) => e.message).join(" ")
}


export class CategoryController {


    static async getCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ) {


        const idValidation = authIdSchema.safeParse(req.query);



        try {
            if (idValidation.success) {
                const { id } = idValidation.data;
                const category =
                    await CategoryService.getCategoryById(id);
                res.status(200).json([category]);
            } else {
                const categories =
                    await CategoryService.getCategories();
                res.status(200).json(categories);
            }
        } catch (error: any) {
            next(error);
        }
    }

    static async createCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        const validation = authCategorySchemas.safeParse(req.body);
        if (!validation.success) {
            res.status(400);
            throw new Error(errorHandler(validation.error.message))
        }

        const { name, description } = validation.data;
        try {
            const category = await CategoryService.createCategory({
                name,
                description,
            });
            res.status(201).json(category);
        } catch (error: any) {
            next(error);
        }
    }

    static async updateCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const idValidation = authIdSchema.safeParse(req.params);

        if (!idValidation.success) {
            res.status(400);
            throw new Error(errorHandler(idValidation.error.message))
        }

        const { id } = idValidation.data;
        const dataValidation = authCategorySchemas.safeParse(req.body);
        if (!dataValidation.success) {
            res.status(400);
            throw new Error(errorHandler(dataValidation.error.message))
        }

        const { name, description } = dataValidation.data;
        try {
            const category = await CategoryService.updateCategory(
                id,
                { name, description }
            );
            res.status(200).json(category);
        } catch (error: any) {
            next(error);
        }
    }

    static async deleteCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        const idValidation = authIdSchema.safeParse(req.params);

        if (!idValidation.success) {
            res.status(400);
            throw new Error(errorHandler(idValidation.error.message))
        }

        const { id } = idValidation.data;
        try {
            await CategoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error: any) {
            next(error);
        }
    }
}
