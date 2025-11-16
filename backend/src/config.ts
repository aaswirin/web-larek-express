/**
 * Настройки из файла .env
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
  /* Сервер Node.js */
  server: {
    port: process.env.PORT || 3000,
  },

  // Настройки базы данных
  database: {
    address: process.env.DB_ADDRESS || 'mongodb://localhost:27017/weblarek',
  },
};

export default config;
