import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { ProductController } from '../controllers/productController';
import { AsyncHandler } from '../middleware';

const router = Router();

router.post('/categories', AsyncHandler(CategoryController.createCategory));
router.post('/products', AsyncHandler(ProductController.createProduct));
router.get('/categories', AsyncHandler(CategoryController.getCategories));
router.get('/products', AsyncHandler(ProductController.getProducts));

export default router;
