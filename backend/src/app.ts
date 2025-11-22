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

import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

/* TODO: Обработать невозможность связи с БД */
mongoose.connect(config.database.address)
  .catch((error) => console.log(error));

// Для отладки
// mongoose.set('debug', true);

app.use(
  cors({
    origin: config.cors.originAllow,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

/* Просто данные */
app.use('/product', productRoutes);
// app.use('/order', );
/* Авторизация и прочая и прочая */
app.use('/auth', authRoutes);
/* Загрузка файлов */
// app.use('/upload', );

// заготовки
// Данные
// app.post('/order', (req, res) => console.log(req, res));
// Файлы
// app.post('/upload', (req, res) => console.log(req, res));
// Авторизация и прочая и прочая
// app.get('/auth/token', (req, res) => console.log(req, res));
// app.post('/auth/login', (req, res) => console.log(req, res));
// app.post('/auth/register', (req, res) => console.log(req, res));
// app.get('/auth/user', (req, res) => console.log(req, res));
// app.get('/auth/logout', (req, res) => console.log(req, res));

app.use(requestLogger);
app.use(errorLogger);
app.use(celebrateErrors());
app.use(errorHandler);

app.listen(config.server.port, () => {
  console.log(`Сервер запущен на порту ${config.server.port}`);
});
