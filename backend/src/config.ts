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
    expiresRefreshDefaultInDay: 7, // Время жизни токена refresh в днях
    expiresAccessDefaultInMinute: 10, // Время жизни токена access в минутах
  },

  /* Сервер Node.js */
  server: {
    port: process.env.PORT || 3000,
  },

  /* Настройки базы данных */
  database: {
    address: process.env.DB_ADDRESS || 'mongodb://localhost:27017/weblarek',
  },

  /* Заказ */
  order: {
    dayToDelete: 111, // Количество дней для удаления старых заказов
  },

  /* Файлы */
  files: {
    uploadPath: process.env.UPLOAD_PATH || 'images',
    uploadPathTemp: process.env.UPLOAD_PATH_TEMP || 'temp',
  },

  /* Это cors */
  cors: {
    originAllow: process.env.ORIGIN_ALLOW || '*',
  },

  /* Для валидации */
  validate: {
    titleProduct: {
      minlength: 8,
      maxlength: 30,
    },
    userName: {
      minlength: 2,
      maxlength: 30,
    },
    email: {
      // eslint-disable-next-line no-control-regex
      regex: /(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/,
    },
    password: {
      minlength: 8,
      regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
    },
    phone: {
      regex: /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/,
    },
    file: {
      /* Максимальный размер загружаемого файла */
      limit: 10 * 1024 * 1024, // 10 мегабайт
    },
  },
};

export default config;
