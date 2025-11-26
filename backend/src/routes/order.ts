/**
 * Роутеры для заказа
 */

import { Router } from 'express';
import createOrder from '../controllers/order';
import { validateOrder } from '../middlewares/validatons';

const router = Router();

router.post('/', validateOrder, createOrder);

export default router;
