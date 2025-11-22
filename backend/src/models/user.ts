/**
 * Модель для пользователей
 */

import mongoose, { Schema } from 'mongoose';
import { IToken, tokenSchema } from './token';

export interface IUser {
  name?: string,
  email: string,
  password: string,
  tokens: IToken[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Логин должен быть указан'],
      unique: true,
      minlength: [2, 'Логин должен быть не менее 2 символов'],
      maxlength: [30, 'Логин должен быть не более 30 символов'],
    },
    email: {
      type: String,
      required: [true, 'Почта должна быть указана'],
      unique: true,
      validate: {
        validator(v: string) {
          // eslint-disable-next-line no-control-regex
          return /(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(v);
        },
        message: 'Некорректный формат Почты. Например, grandfather@village.рф',
      },
    },
    password: {
      type: String,
      required: [true, 'Пароль должен быть указан'],
      minlength: [8, 'Поле "Логин" должно быть не менее 8 символов'],
      select: false,
      validate: {
        validator(v: string) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(v);
        },
        message: 'Пароль должен содержать строчные и прописные буквы, цифры и специальные символы',
      },

    },
    tokens: {
      type: [tokenSchema],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>('user', userSchema);
