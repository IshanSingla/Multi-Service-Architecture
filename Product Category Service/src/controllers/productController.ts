import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
    static async getProducts(req: Request, res: Response) {
        const { category, sort_by } = req.query;
        try {
            const products = await ProductService.getProducts({
                category,
                sort_by,
            });
            res.status(200).json(products);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getProductById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const product = await ProductService.getProductById(id);
            res.status(200).json(product);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    static async createProduct(req: Request, res: Response) {
        const { name, price, category_id, description } = req.body;
        try {
            const product = await ProductService.createProduct({
                name,
                price,
                category_id,
                description,
            });
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateProduct(req: Request, res: Response) {
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
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteProduct(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await ProductService.deleteProduct(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
