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
import auth from '../middlewares/auth';

const router = Router();

router.get('/', readProducts);
router.post('/', auth, validateProduct, createProduct);
router.patch('/:productId', auth, updateProduct);
router.delete('/:productId', auth, deleteProduct);

export default router;
