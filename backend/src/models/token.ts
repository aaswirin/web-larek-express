/**
 * Модель для токена
 */

import { Schema } from 'mongoose';

interface IToken {
  token: string;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: [true, 'Токен должен быть указан'],
    },
  },
  { _id: false },
);

export {
  IToken,
  tokenSchema,
};
