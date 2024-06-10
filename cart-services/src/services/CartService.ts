import { prisma } from '../configs/prisma';


class CartService {
    static async getCartItems(userId: string, products: any[]) {
        try {
            const userCart = await prisma.cart.findUnique({
                where: { userId },
                include: { items: true },
            });
            return (
                userCart?.items?.map((item) => ({
                    productId: item.productId,
                    product: products.find(
                        (product) => product.id === item.productId
                    ),
                    quantity: item.quantity,
                })) || []
            );
        } catch (error) {
            throw new Error('Failed to fetch cart items');
        }
    }

    static async addToCart(
        userId: string,
        productId: string,
        quantity: number
    ) {
        try {
            const cart = await prisma.cart.findUnique({
                where: { userId },
            });
            if (!cart) {
                if (quantity < 0) {
                    throw new Error('Invalid quantity');
                }
                // If cart does not exist, create a new cart with the item
                await prisma.cart.create({
                    data: {
                        userId,
                        items: [
                            {
                                productId,
                                quantity,
                            },
                        ],
                    },
                });
            } else {
                // If cart exists, check if the item is already in the cart
                const itemIndex = cart.items.findIndex(
                    (item) => item.productId === productId
                );
                if (itemIndex > -1) {
                    if (
                        quantity < 0 &&
                        cart.items[itemIndex].quantity + quantity <= 0
                    ) {
                        // remove item from cart if quantity is less than 0
                        cart.items.splice(itemIndex, 1);
                    } else {
                        cart.items[itemIndex].quantity += quantity;
                    }
                } else {
                    if (quantity < 0) {
                        throw new Error('Invalid quantity');
                    }
                    // If item does not exist, add the new item
                    cart.items.push({
                        productId,
                        quantity,
                        createdAt: new Date(),
                    });
                }
                // Update the cart with the new items array
                await prisma.cart.update({
                    where: { userId },
                    data: { items: { set: cart.items } },
                });
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    static async removeFromCart(userId: string, productId: string) {
        try {
            const cart = await prisma.cart.findUnique({
                where: { userId },
            });
            if (cart) {
                // Filter out the item from the items array
                const updatedItems = cart.items.filter(
                    (item) => item.productId !== productId
                );
                // Update the cart with the new items array
                await prisma.cart.update({
                    where: { userId },
                    data: { items: { set: updatedItems } },
                });
            }
        } catch (error) {
            throw new Error('Failed to remove item from cart');
        }
    }

    static async getUserCart(userId: string, products: any[]) {
        try {
            const userCart = await prisma.cart.findUnique({
                where: { userId },
                include: { items: true },
            });

            return (
                userCart?.items?.map((item) => ({
                    productId: item.productId,
                    product: products.find(
                        (product) => product.id === item.productId
                    ),
                    quantity: item.quantity,
                })) || []
            );
        } catch (error) {
            throw new Error('Failed to fetch user cart');
        }
    }

    static async emptyCart(userId: string) {
        try {
            await prisma.cart.delete({ where: { userId } });
        } catch (error) {
            throw new Error('Failed to empty cart');
        }
    }
}

export default CartService;
