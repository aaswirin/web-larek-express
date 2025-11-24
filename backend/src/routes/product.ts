/**
 * Роутеры для товара
 */

import { Router } from 'express';
import {
  createProduct,
  readProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/products';
import { validateProduct } from '../middlewares/validatons';

const router = Router();

router.get('/', readProducts);
router.post('/', validateProduct, createProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;
