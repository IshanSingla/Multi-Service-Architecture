import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
    static async getProducts(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { category, sort_by, id }: any = req.query;
        try {
            if (id) {
                const product = await ProductService.getProductById(
                    id
                );
                if (!product) {
                    res.status(404);
                    throw new Error('Product not found');
                }
                res.status(200).json([product]);
            } else {
                const products = await ProductService.getProducts({
                    category,
                    sort_by,
                });
                res.status(200).json(products);
            }
        } catch (error: any) {
            if (error.message === 'Product not found') {
                res.status(404);
            }
            next(error);
        }
    }

    static async getProductById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { id }: any = req.query;
        try {
            const product = await ProductService.getProductById(id);
            res.status(200).json(product);
        } catch (error: any) {
            res.status(404)
            next(error);
        }
    }

    static async createProduct(req: Request, res: Response, next: NextFunction) {
        const { name, price, category_id, description } = req.body;
        try {
            const product = await ProductService.createProduct({
                name,
                price,
                categoryId: category_id,
                description,
            });
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400)
            next(error);
        }
    }

    static async updateProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { id } = req.params;
        const { name, price, category_id, description } = req.body;
        try {
            const product = await ProductService.updateProduct(id, {
                name,
                price,
                category_id,
                description,
            });
            res.status(200).json(product);
        } catch (error: any) {
            res.status(400)
            next(error);
        }
    }

    static async deleteProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { id } = req.params;
        try {
            await ProductService.deleteProduct(id);
            res.status(204).send();
        } catch (error: any) {
            next(error);
        }
    }
}
