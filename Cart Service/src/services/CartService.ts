import { prisma } from '../configs/prisma';

class CartService {
    static async getCartItems(userId: string) {
        try {
            const userCart = await prisma.cart.findUnique({
                where: { userId },
                include: { items: true },
            });
            return userCart?.items || [];
        } catch (error) {
            console.error('Error fetching cart items:', error);
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
                    // If item exists, update the quantity
                    cart.items[itemIndex].quantity += quantity;
                } else {
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
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw new Error('Failed to add item to cart');
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
            console.error('Error removing item from cart:', error);
            throw new Error('Failed to remove item from cart');
        }
    }

    static async getUserCart(userId: string) {
        try {
            return await prisma.cart.findUnique({
                where: { userId },
                select: { items: true },
            });
        } catch (error) {
            console.error('Error fetching user cart:', error);
            throw new Error('Failed to fetch user cart');
        }
    }

    static async emptyCart(userId: string) {
        try {
            await prisma.cart.delete({ where: { userId } });
        } catch (error) {
            console.error('Error emptying cart:', error);
            throw new Error('Failed to empty cart');
        }
    }
}

export default CartService;
