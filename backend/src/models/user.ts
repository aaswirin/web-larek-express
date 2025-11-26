/**
 * Модель для пользователей
 */

import mongoose, { Schema } from 'mongoose';
import { IToken, tokenSchema } from './token';
import config from '../config';

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
      minlength: [
        config.validate.userName.minlength,
        `Минимальный размер логина, символов: ${config.validate.userName.minlength}`,
      ],
      maxlength: [
        config.validate.userName.maxlength,
        `Максимальный размер логина, символов: ${config.validate.userName.maxlength}`,
      ],
    },
    email: {
      type: String,
      required: [true, 'Почта должна быть указана'],
      unique: true,
      validate: {
        validator(v: string) {
          return config.validate.email.regex.test(v);
        },
        message: 'Некорректный формат Почты. Например, grandfather@village.рф',
      },
    },
    password: {
      type: String,
      required: [true, 'Пароль должен быть указан'],
      minlength: [
        config.validate.password.minlength,
        `Минимальный размер логина, символов: ${config.validate.password.minlength}`,
      ],
      select: false,
      validate: {
        validator(v: string) {
          return config.validate.password.regex.test(v);
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
