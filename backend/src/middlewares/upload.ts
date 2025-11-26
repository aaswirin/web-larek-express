/**
 * Файл изображения
 */

import { Express, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config';

/* Каталог-помойка */
const tempDir = path.join(__dirname, `../public/${config.files.uploadPathTemp}`);

/* Если нет, то создать! */
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/* Хранилище */
const storage = multer.diskStorage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filename: (req, file, cb) => {
    const uniqueName = `${new Date().toLocaleString()}-${Math.round(Math.random() * 1e13)}`;
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/* Грузить только файлы изображений */
const fileFilter = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  /* Только изображения! */
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только файлы изображений'));
  }
};

export default multer({ storage, fileFilter, limits: { fileSize: config.validate.file.limit } });
