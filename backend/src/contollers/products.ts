/**
 * Контроллер для товара
 */

import { NextFunction, Request, Response } from 'express';
import Product, { IProduct } from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

/**
 * Создать товар (C)
 * @param req  - запрос, новый товар
 * @param res  - ответ, созданный товар
 * @param next - следующий обработчик
 * */
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productObject: IProduct = req.body;

    if (!productObject.title || !productObject.image) {
      next(new BadRequestError('Название и изображение товара должны быть указаны'));
    }

    const newObject: IProduct = await Product.create(productObject);

    /* Отлично! Новый товар поступает в продажу */
    res.status(201).json(newObject);
  } catch (error: any) {
    /* Товар уже есть */
    if (error.code === 11000) {
      next(new ConflictError('Товар с таким названием уже существует'));
    }

    /* Валидация не прошла */
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    }

    /* Что-то другое */
    next(error);
  }
};

/**
 * Получить все товары (R)
 * @param _req - запрос, здесь не нужен
 * @param res  - ответ, отдаю список товаров
 * @param next - следующий обработчик
 */
const readProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('Starting products');
    const products: IProduct[] = await Product.find();
    console.log(products);

    /* Отдать все товары */
    res.status(200).json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить товар (U)
 * @param req  - запрос, обновляемый товар
 * @param res  - ответ, обновлённый товар
 * @param next - следующий обработчик
 */
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const updates: Partial<IProduct> = req.body;

    /* Пробую обновить */
    const updatedObject = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    /* Упс... Не получилось */
    if (!updatedObject) {
      next(new NotFoundError('Товар не найден'));
    }

    /* Вернуть обновлённый товар */
    res.status(200).json(updatedObject);
  } catch (error: any) {
    /* Валидация не прошла */
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    }

    /* Что-то другое */
    next(error);
  }
};

/**
 * Удалить товар (D)
 * @param req  - запрос, ID удаляемого товара
 * @param res  - ответ, удалённый товар
 * @param next - следующий обработчик
 */
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    /* Пробую удалить */
    const deletedObject = await Product.findByIdAndDelete(productId);

    /* Нет такого товара */
    if (!deletedObject) {
      next(new NotFoundError('Товар не найден'));
    }

    /* Вернуть удалённый товар */
    res.status(200).json(deletedObject);
  } catch (error: any) {
    /* Что-то пошло не так */
    next(error);
  }
};

/* CRUD */
export {
  createProduct,
  readProducts,
  updateProduct,
  deleteProduct,
};
