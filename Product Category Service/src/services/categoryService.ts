import { PrismaClient } from '@prisma/client';
import { RedisUtils } from '../utils/redisUtils';
import { prisma } from '../configs/prisma';


export class CategoryService {
    static async getCategories() {
        const cacheKey = 'categories';

        const cachedCategories = await RedisUtils.getCache(cacheKey);
        if (cachedCategories) return JSON.parse(cachedCategories);

        const categories = await prisma.category.findMany();
        await RedisUtils.setCache(
            cacheKey,
            JSON.stringify(categories)
        );
        return categories;
    }

    static async getCategoryById(id: string) {
        const cacheKey = `category_${id}`;

        const cachedCategory = await RedisUtils.getCache(cacheKey);
        if (cachedCategory) return JSON.parse(cachedCategory);

        const category = await prisma.category.findUnique({
            where: { id },
        });

        if (!category) throw new Error('Category not found');

        await RedisUtils.setCache(cacheKey, JSON.stringify(category));
        return category;
    }

    static async createCategory(data: any) {
        const category = await prisma.category.create({ data });
        await RedisUtils.clearCache('categories');
        return category;
    }

    static async updateCategory(id: string, data: any) {
        const category = await prisma.category.update({
            where: { id },
            data,
        });
        await RedisUtils.clearCache(`categories`, `category_${id}`);
        return category;
    }

    static async deleteCategory(id: string) {
        await prisma.category.delete({ where: { id } });
        await RedisUtils.clearCache(`categories`, `category_${id}`);
    }
}
