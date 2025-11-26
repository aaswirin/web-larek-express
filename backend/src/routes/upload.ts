/**
 * Роутеры для файла изображения
 */

import { Router } from 'express';
import uploadMiddleware from '../middlewares/upload';
import uploadFile from '../controllers/upload';
import auth from '../middlewares/auth';

const router = Router();

router.post('/', auth, uploadMiddleware.single('file'), uploadFile);

export default router;
