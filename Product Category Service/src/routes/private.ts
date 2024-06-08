import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { ProductController } from '../controllers/productController';

const router = Router();

router.post('/categories', CategoryController.createCategory);
router.post('/products', ProductController.createProduct);

export default router;
