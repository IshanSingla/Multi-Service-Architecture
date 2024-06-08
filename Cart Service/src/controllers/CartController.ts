import { Request, Response } from 'express';
import ForeignService from '../services/ForeignService'; // Assuming ForeignService is defined elsewhere
import CartService from '../services/CartService';

class CartController {
    static async getCartItems(
        req: any,
        res: Response
    ): Promise<void> {
        try {
            const cartItems = await CartService.getCartItems(
                req.user.id
            );
            res.status(200).json(cartItems);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            res.status(500).json({
                error: 'Failed to fetch cart items',
            });
        }
    }

    static async addToCart(req: any, res: Response): Promise<void> {
        try {
            const { productId, quantity } = req.body;
            if (!productId || !quantity) {
                res.status(400).json({
                    error: 'Product ID and quantity are required',
                });
                return;
            }
            // Call ProductService to get product details
            const productDetails =
                await ForeignService.getProductDetails(productId);
            if (!productDetails) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            // Add item to cart
            await CartService.addToCart(
                req.user.id,
                productId,
                quantity
            );
            res.status(200).json({
                message: 'Product added to cart successfully',
            });
        } catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({
                error: 'Failed to add item to cart',
            });
        }
    }

    static async removeFromCart(
        req: any,
        res: Response
    ): Promise<void> {
        try {
            const { productId } = req.body;
            if (!productId) {
                res.status(400).json({
                    error: 'Product ID is required',
                });
                return;
            }
            // Remove item from cart
            await CartService.removeFromCart(req.user.id, productId);
            res.status(200).json({
                message: 'Product removed from cart successfully',
            });
        } catch (error) {
            console.error('Error removing item from cart:', error);
            res.status(500).json({
                error: 'Failed to remove item from cart',
            });
        }
    }

    static async getUserCart(req: any, res: Response): Promise<void> {
        try {
            // Placeholder implementation to get user's cart without product details
            const userCart = await CartService.getUserCart(
                req.user.id
            );
            res.status(200).json(userCart);
        } catch (error) {
            console.error('Error fetching user cart:', error);
            res.status(500).json({
                error: 'Failed to fetch user cart',
            });
        }
    }

    static async emptyCart(req: any, res: Response): Promise<void> {
        try {
            // Placeholder implementation to empty user's cart
            await CartService.emptyCart(req.user.id);
            res.status(200).json({
                message: 'Cart emptied successfully',
            });
        } catch (error) {
            console.error('Error emptying cart:', error);
            res.status(500).json({ error: 'Failed to empty cart' });
        }
    }
}

export default CartController;
