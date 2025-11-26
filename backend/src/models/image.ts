/**
 * Модель для изображений
 */

import { Schema } from 'mongoose';

export interface IProductImage {
  fileName: string;
  originalName: string;
}

export const imageSchema = new Schema<IProductImage>({
  fileName: {
    type: String,
    required: [true, 'Имя файла должно быть указано'],
  },
  originalName: {
    type: String,
    required: [true, 'Название файла должно быть указано'],
  },
}, { _id: false });
