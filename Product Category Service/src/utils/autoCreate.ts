import { prisma } from '../configs/prisma';

const predefinedCoupons = [
    // ... (existing predefined coupons)
];

const predefinedCategories = [
    {
        name: 'Category 1',
        description: 'Description for Category 1',
    },
    {
        name: 'Category 2',
        description: 'Description for Category 2',
    },
];

const predefinedProducts = [
    {
        name: 'Product A',
        price: 100.0,
        description: 'Description for Product A',
    },
    {
        name: 'Product B',
        price: 200.0,
        description: 'Description for Product B',
    },
];

async function initializeCategories() {
    for (const categoryData of predefinedCategories) {
        const existingCategory = await prisma.category.findFirst({
            where: { name: categoryData.name },
        });

        if (!existingCategory) {
            await prisma.category.create({
                data: {
                    name: categoryData.name,
                    description: categoryData.description,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        }
    }
}

async function initializeProducts() {
    const existingCategory = await prisma.category.findFirst();
    for (const productData of predefinedProducts) {
        const existingProduct = await prisma.product.findFirst({
            where: { name: productData.name },
        });

        if (!existingProduct) {
            await prisma.product.create({
                data: {
                    name: productData.name,
                    price: productData.price,
                    categoryId: existingCategory?.id,
                    description: productData.description,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        }
    }
}

export async function initializeData() {
    await initializeCategories();
    await initializeProducts();
}
