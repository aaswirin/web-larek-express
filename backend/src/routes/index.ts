/**
 * Все роутеры
 */

import { Router } from 'express';
import NotFoundError from '../errors/not-found-error';
import productRouter from './product';

const router = Router();

router.use('/product', productRouter);
/* router.use('/order', orderRouter); */
router.use('*', (_req, _res, next) => next(new NotFoundError('Route not found')));

export default router;
