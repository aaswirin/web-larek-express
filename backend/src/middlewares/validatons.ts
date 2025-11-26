/**
 * Проверки всякие
 */

import { Joi, Segments, celebrate } from 'celebrate';

/**
 * Проверка товара при создании
 */
const validateProduct = celebrate(
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

/**
 * Проверка заказа при создании
 */
const validateOrder = celebrate(
  {
    [Segments.BODY]: Joi.object({
      payment: Joi.string().valid('card', 'online').required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.string().required(),
      total: Joi.number().required(),
      items: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    }),
  },
  { abortEarly: false },
);

export {
  validateProduct,
  validateOrder,
};
