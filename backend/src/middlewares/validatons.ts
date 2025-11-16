/**
 * Проверки всякие
 */

import { Joi, Segments, celebrate } from 'celebrate';

/**
 * Проверка товара при создании
 */
export const validateProduct = celebrate(
  {
    [Segments.BODY]: Joi.object({
      title: Joi.string().min(2).max(30).required(),
      image: Joi.object({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
      }).required(),
      category: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().allow(null),
    }),
  },
  { abortEarly: false },
);

/*
export const validateOrder = celebrate(
  {
  },
  { abortEarly: false },
);
 */
