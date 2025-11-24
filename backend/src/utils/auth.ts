/**
 * Функции для авторизации
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import config from '../config';

/* Оба два токена */
type TTokens = {
  accessToken: string;
  refreshToken: string;
}

/**
 * Перевести строку вида 'Nc' в секунды, где
 *   N - число
 *   c - символ из набора: 'm'- минута, 'h' - час, 'd' - день
 * @param expiry  - строка 'Nc'
 * @return number - количество секунд
 */
const getExpiryInSeconds = (expiry: string): number => {
  // По умолчанию N дня
  const defSeconds = config.auth.expiresRefreshDefaultInDay * 24 * 60 * 60;

  if (expiry === '') {
    return defSeconds;
  }

  let seconds = parseInt(expiry, 10);
  if (Number.isNaN(seconds)) {
    return defSeconds;
  }

  const char = expiry[expiry.length - 1];

  switch (char) {
    case 'm': // Минуты
      seconds *= 60;
      break;
    case 'h': // Часы
      seconds *= 60 * 60;
      break;
    case 'd': // Дни
      seconds *= 24 * 60 * 60;
      break;
    default: // По умолчанию 3 дня
      seconds = defSeconds;
  }

  return seconds;
};

/**
 * Создать токен
 * @param payload - из чего создать
 * @param secret  - секретик
 * @param expires - сколько будет жить в секундах
 * @return string - токен
 */
const createToken = (
  payload: object,
  secret: string,
  expires: number,
): string => jwt.sign(payload, secret, { expiresIn: expires } as SignOptions);

/**
 * Получить сразу два токена
 * @param userId         - Id пользователя
 * @param expiryAccess   - Время жизни токена в секундах
 * @param expiryRefresh  - Время жизни токена в секундах
 * @return TTokens        - Токены {accessToken, refreshToken}
 */
const createTwoTokens = (
  userId: ObjectId,
  expiryAccess: number,
  expiryRefresh: number,
): TTokens => {
  const accessToken = createToken(
    { _id: userId },
    config.auth.accessSecret as string,
    expiryAccess,
  );
  const refreshToken = createToken(
    { _id: userId },
    config.auth.refreshSecret as string,
    expiryRefresh,
  );

  return { accessToken, refreshToken };
};

export {
  getExpiryInSeconds,
  createToken,
  createTwoTokens,
};
