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
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(v);
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
