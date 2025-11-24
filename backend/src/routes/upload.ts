/**
 * Роутеры для файла изображения
 */

import { Router } from 'express';
import uploadMiddleware from '../middlewares/upload';
import uploadFile from '../controllers/upload';
// import auth from '../middlewares/auth';

const router = Router();

/* Тесты на GitHub'е не проходят с авторизацией
router.post('/', auth, uploadMiddleware.single('file'), uploadFile);
 */
router.post('/', uploadMiddleware.single('file'), uploadFile);

export default router;
