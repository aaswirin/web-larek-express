/**
 * Контроллеры для товара
 */

import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import Order, { IOrder } from '../models/order';
import BadRequestError from '../errors/bad-request-error';
import config from '../config';

/* Количество миллисекунд в сутках */
const mSecondsInDay = 24 * 60 * 60 * 1000;

/**
 * Новый заказ
 * @param req  - запрос, новый заказ
 * @param res  - ответ, созданный товар
 * @param next - следующий обработчик
 */
const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      payment,
      email,
      phone,
      address,
      total,
      items,
    } = req.body;

    /* Обязательные поля */
    if (!payment || !email || !phone || !address || !total || !items?.length) {
      return next(new BadRequestError('Не все обязательные поля заполнены'));
    }

    /* Проверка типа оплаты */
    if (!['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Неверный способ оплаты'));
    }

    /* Товары есть? */
    const products = await Product.find({ _id: { $in: items } });
    /* Что-то не найдено */
    if (products.length !== items.length) {
      /* А чего не найдено? */
      products.forEach((product) => {
        const index = items.indexOf(product._id);
        if (index !== -1) items.splice(index, 1);
      });
      const message = `Товары из заказа не найдены в базе данных: ${items.join(', ')}`;
      return next(new BadRequestError(message));
    }

    /* Цена есть? Сумма заказа? */
    let sumOrder = 0;
    products.forEach((product) => {
      if (!product.price) return next(new BadRequestError(`Товар "${product.title}" без цены`));
      sumOrder += product.price;
      return null;
    });

    if (sumOrder !== total) {
      return next(new BadRequestError(`Сумма заказа (${total}) не равна сумме по строкам (${sumOrder})`));
    }

    /* Сохранить заказ для потомков
       ... и налоговой
     */
    const newObject: IOrder = await Order.create({
      payment,
      email,
      phone,
      address,
      total,
      items,
      dateOrder: new Date(),
    });

    /* Дабы база не распухала, удалим всё что позже N дней */
    Order.deleteMany({
      orderDate:
        { $lt: new Date(Date.now() - config.order.dayToDelete * mSecondsInDay) },
    });

    return res.status(200).json({
      id: newObject._id,
      total,
    });
  } catch (error) {
    next(error);
  }

  return null;
};

export default createOrder;
