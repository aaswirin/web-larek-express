/**
 * Модель для товаров
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IProductImage, imageSchema } from './image';

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
    minlength: [2, 'Название должно быть не менее 2 символов'],
    maxlength: [30, 'Название должно быть не более 30 символов'],
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
