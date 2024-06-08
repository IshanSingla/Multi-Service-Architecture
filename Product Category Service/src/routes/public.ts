import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { ProductController } from '../controllers/productController';

const router = Router();

router.get('/categories', CategoryController.getCategories);
router.get('/products', ProductController.getProducts);

export default router;
