/**
 * Роутеры для файла изображения
 */

import { Router } from 'express';
import uploadMiddleware from '../middlewares/upload';
import uploadFile from '../controllers/upload';

const router = Router();

router.post('/', uploadMiddleware.single('file'), uploadFile);

export default router;
