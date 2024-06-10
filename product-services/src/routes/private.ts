import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { ProductController } from '../controllers/productController';

const router = Router();

router.post('/categories', CategoryController.createCategory);
router.post('/products', ProductController.createProduct);
router.get('/categories', CategoryController.getCategories);
router.get('/products', ProductController.getProducts);

export default router;
