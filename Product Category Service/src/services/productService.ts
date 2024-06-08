import { PrismaClient } from '@prisma/client';
import { RedisUtils } from '../utils/redisUtils';
import { prisma } from '../configs/prisma';

export class ProductService {
    static async getProducts(filters: any) {
        const { category, sort_by } = filters;
        const cacheKey = `products_${category}_${sort_by}`;

        const cachedProducts = await RedisUtils.getCache(cacheKey);
        if (cachedProducts) return JSON.parse(cachedProducts);

        const products = await prisma.product.findMany({
            where: {
                category_id: category,
            },
            orderBy: {
                price: sort_by,
            },
        });

        await RedisUtils.setCache(cacheKey, JSON.stringify(products));
        return products;
    }

    static async getProductById(id: string) {
        const cacheKey = `product_${id}`;

        const cachedProduct = await RedisUtils.getCache(cacheKey);
        if (cachedProduct) return JSON.parse(cachedProduct);

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) throw new Error('Product not found');

        await RedisUtils.setCache(cacheKey, JSON.stringify(product));
        return product;
    }

    static async createProduct(data: any) {
        const product = await prisma.product.create({ data });
        await RedisUtils.clearCache('products_*');
        return product;
    }

    static async updateProduct(id: string, data: any) {
        const product = await prisma.product.update({
            where: { id },
            data,
        });
        await RedisUtils.clearCache(`products_*`, `product_${id}`);
        return product;
    }

    static async deleteProduct(id: string) {
        await prisma.product.delete({ where: { id } });
        await RedisUtils.clearCache(`products_*`, `product_${id}`);
    }
}
