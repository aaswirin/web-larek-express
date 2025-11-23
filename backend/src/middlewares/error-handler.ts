/**
 * Разные ошибки
 */

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Ошибки MongoDB
  if (err instanceof mongoose.mongo.MongoServerError) {
    const error: mongoose.mongo.MongoServerError = err;
    /* Это дубликаты */
    if (error.code === 11000) {
      /* Пользователь дублируется */
      if (error.message.includes('.users')) {
        /* Чего дублируется ? */
        const fields: String[] = [];
        Object.keys(error.errorResponse.keyValue).forEach((key) => {
          fields.push(`"${error.errorResponse.keyValue[key]}"`);
        });

        const message = `Запись с такими  полями ${fields.join(', ')} уже есть.`;

        return res
          .status(409)
          .json({ message });
      }
    }
  }

  if (err.message.includes('E11000')) {
    return res
      .status(409)
      .json({ message: `Ошибка базы данных ${err.message}` });
  }

  // Ошибка по умолчанию
  res.status(500).json({ message: 'Internal server error' });

  return null;
};

export default errorHandler;
