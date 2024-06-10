import { NextFunction, Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
    static async getCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { id }: any = req.query;
        try {
            if (id) {
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
        const { name, description } = req.body;
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
        const { id } = req.params;
        const { name, description } = req.body;
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
        const { id } = req.params;
        try {
            await CategoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error: any) {
            next(error);
        }
    }
}
