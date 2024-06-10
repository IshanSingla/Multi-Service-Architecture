import { Request, Response } from 'express';
import ForeignService from '../services/ForeignService'; // Assuming ForeignService is defined elsewhere
import CartService from '../services/CartService';

class CartController {
    static async getCartItems(
        req: any,
        res: Response
    ): Promise<void> {
        const cartItems = await CartService.getCartItems(req.user.id);
        res.status(200).json(cartItems);
    }

    static async addToCart(req: any, res: Response): Promise<void> {
        try {
            const { productId, quantity } = req.body;
            if (!productId || !quantity) {
                res.status(400);
                throw new Error(
                    'Product ID and quantity are required'
                );
            }
            // Call ProductService to get product details
            try {
                const productDetails =
                    await ForeignService.getProductDetails(productId);
                if (!productDetails) {
                    res.status(404);
                    throw new Error('Product not found');
                }
            } catch (error: any) {
                res.status(404);
                throw new Error(error.message);
            }
            // Add item to cart
            await CartService.addToCart(
                req.user.id,
                productId,
                quantity
            );
            res.status(200).json(
                'Product added to cart successfully'
            );
        } catch (error: any) {
            if (error.message === 'Invalid quantity') {
                res.status(400);
            }
            throw new Error(error.message);
        }
    }

    static async removeFromCart(
        req: any,
        res: Response
    ): Promise<void> {
        const { productId } = req.body;
        if (!productId) {
            res.status(400);
            throw new Error('Product ID is required');
        }
        // Remove item from cart
        await CartService.removeFromCart(req.user.id, productId);
        res.status(200).json(
            'Product removed from cart successfully'
        );
    }

    static async getUserCart(req: any, res: Response): Promise<void> {
        const userCart = await CartService.getUserCart(req.user.id);
        res.status(200).json(userCart);
    }

    static async emptyCart(req: any, res: Response): Promise<void> {
        await CartService.emptyCart(req.user.id);
        res.status(200).json('Cart emptied successfully');
    }
}

export default CartController;
