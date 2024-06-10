import { Request, Response } from 'express';
import ForeignService from '../services/ForeignService'; // Assuming ForeignService is defined elsewhere
import CartService from '../services/CartService';
import { productIDSchema, AddSchema } from '../DTO/cart';
import { zodErrorHandler } from '../DTO';


class CartController {
    static async getCartItems(
        req: any,
        res: Response
    ): Promise<void> {


        const data = await ForeignService.getProductDetails();
        const cartItems = await CartService.getCartItems(
            req.user.id,
            data
        );
        res.status(200).json(cartItems);
    }

    static async addToCart(req: any, res: Response): Promise<void> {
        const validation = AddSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400);
            throw new Error(
                zodErrorHandler(validation.error.message)
            );
        }
        try {
            const { productId, quantity } = validation.data;
            // Call ProductService to get product details
            try {
                const productDetails =
                    await ForeignService.getProductDetailsById(
                        productId
                    );
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
        const validation = productIDSchema.safeParse(req.body)
        if (!validation.success) {
            res.status(400);
            throw new Error(
                zodErrorHandler(validation.error.message)
            );
        }
        const { productId } = validation.data;
        // Remove item from cart
        await CartService.removeFromCart(req.user.id, productId);
        res.status(200).json(
            'Product removed from cart successfully'
        );
    }

    static async getUserCart(req: any, res: Response): Promise<void> {
        const data = await ForeignService.getProductDetails();
        const userCart = await CartService.getUserCart(req.user.id, data);
        res.status(200).json(userCart);
    }

    static async emptyCart(req: any, res: Response): Promise<void> {
        await CartService.emptyCart(req.user.id);
        res.status(200).json('Cart emptied successfully');
    }
}

export default CartController;
