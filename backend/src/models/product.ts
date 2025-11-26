/**
 * Модель для товаров
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IProductImage, imageSchema } from './image';
import config from '../config';

export interface IProduct extends Document {
  title: string;
  image: IProductImage;
  category: string;
  description?: string;
  price?: number | null;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Название должно быть указано'],
    unique: true,
    minlength: [
      config.validate.titleProduct.minlength,
      `Минимальный размер названия, символов: ${config.validate.titleProduct.minlength}`,
    ],
    maxlength: [
      config.validate.titleProduct.maxlength,
      `Максимальный размер названия, символов: ${config.validate.titleProduct.maxlength}`,
    ],
    trim: true,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Категория должна быть указана'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    default: null,
  },
}, {
  versionKey: false,
});

export default mongoose.model<IProduct>('product', productSchema);
