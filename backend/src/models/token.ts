/**
 * Модель для токена
 */

import { Schema } from 'mongoose';

export interface IToken {
  token: string;
}

export const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: [true, 'Токен должен быть указан'],
    },
  },
  { _id: false },
);
