/**
 * Модель для заказов
 */

import mongoose, {
  Schema,
  Document,
} from 'mongoose';

import config from '../config';

export interface IOrder extends Document {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  dateOrder: Date;
}

const orderSchema = new Schema<IOrder>({
  payment: {
    type: String,
    required: [true, 'Тип оплаты должен быть указан'],
    enum: ['card', 'online'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Почта должна быть указана'],
    validate: {
      validator(v: string) {
        return config.validate.email.regex.test(v);
      },
      message: 'Некорректный формат Почты. Например, grandfather@village.рф',
    },
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Телефон должен быть указан'],
    validate: {
      validator(v: string) {
        return config.validate.phone.regex.test(v);
      },
      message: 'Некорректный формат Телефона. Например, +7(123)456-78-90',
    },
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Адрес должен быть указан'],
    trim: true,
  },
  total: {
    type: Number,
    required: [true, 'Сумма заказа должна быть указана'],
  },
  items: {
    type: [String],
    required: [true, 'список товаров в заказе должен быть указан'],
  },
  dateOrder: {
    type: Date,
  },
}, {
  versionKey: false,
});

export default mongoose.model<IOrder>('order', orderSchema);
