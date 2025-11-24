/**
 * Контроллеры для файла изображения
 */

import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import config from '../config';

/**
 * Загрузить файл
 * @param req  - запрос, сам файл
 * @param res  - ответ, имена файла
 * @param next - следующий обработчик
 */
const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Нет файла' });
    }

    const targetDir = path.join(__dirname, `../../public/${config.files.uploadPath}`);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, req.file.filename);
    fs.renameSync(req.file.path, targetPath);

    res.status(200).json({
      fileName: `/${config.files.uploadPath}/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (err) {
    return next(err);
  }

  return null;
};

export default uploadFile;
