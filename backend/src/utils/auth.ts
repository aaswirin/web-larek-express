/**
 * Функции для авторизации
 */

import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Перевести строку вида 'Nc' в секунды, где
 *   N - число
 *   c - символ из набора: 'm'- минута, 'h' - час, 'd' - день
 * @param expiry - строка 'Nc'
 * @return       - количество секунд
 */
const getExpiryInSeconds = (expiry: string): number => {
  // По умолчанию 3 дня
  const defSeconds = 3 * 24 * 60 * 60;

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
 */
const createToken = (
  payload: object,
  secret: string,
  expires: number,
): string => jwt.sign(payload, secret, { expiresIn: expires } as SignOptions);

export {
  getExpiryInSeconds,
  createToken,
};
