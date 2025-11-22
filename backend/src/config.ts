/**
 * Настройки из файла .env
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
  /* Авторизация */
  auth: {
    accessExpires: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
    accessSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  },

  /* Сервер Node.js */
  server: {
    port: process.env.PORT || 3000,
  },

  /* Настройки базы данных */
  database: {
    address: process.env.DB_ADDRESS || 'mongodb://localhost:27017/weblarek',
  },

  /* Это cors */
  cors: {
    originAllow: process.env.ORIGIN_ALLOW || '*',
  },
};

export default config;
