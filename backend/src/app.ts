/**
 * Главный файл приложения
 */

import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';
import config from './config';

/* Роутеры */
import productRoutes from './routes/product';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import orderRoutes from './routes/order';

import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

mongoose.connect(config.database.address)
  .catch((error) => console.error('Нет связи с  connection failed: ', error));

// Для отладки
// mongoose.set('debug', true);

app.use(
  cors({
    origin: config.cors.originAllow,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

/* Просто данные */
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
/* Авторизация и прочая и прочая */
app.use('/auth', authRoutes);
/* Загрузка файлов */
app.use('/upload', uploadRoutes);

app.use(requestLogger);
app.use(errorLogger);
app.use(celebrateErrors());
app.use(errorHandler);

app.listen(config.server.port, () => {
  console.log(`Сервер запущен на порту ${config.server.port}`);
});
