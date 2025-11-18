/**
 * Контроллеры для авторизации
 */

import {
  Request,
  Response,
  NextFunction,
} from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';

import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';

/**
 * Регистрация
 * @param req  - запрос, новый товар
 * @param res  - ответ, созданный товар
 * @param next - следующий обработчик
 */
const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new BadRequestError('Все поля должны быть указаны'));
    }

    const hash = '';
    const user = await User.create({
      name, email, password: hash, tokens: [],
    });

    const accessToken = '';
    res.status(201).json({
      success: true,
      user: { name: user.name, email: user.email, id: user._id },
      accessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Авторизация
 * @param req  - запрос, новый товар
 * @param res  - ответ, созданный товар
 * @param next - следующий обработчик
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new BadRequestError('Все поля должны быть указаны'));

    const user = await User.findOne({ email });
    if (!user) return next(new UnauthorizedError('Неверные почта или пароль'));

    const isCompare = await bcrypt.compare(password, user.password);
    if (!isCompare) return next(new UnauthorizedError('Неверные почта или пароль'));

    const accessToken = '';
    const refreshToken = '';

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
      accessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Получить пользователя
 * @param req
 * @param res
 * @param next
 */
const user = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new UnauthorizedError('Пользователь не авторизован'));

    const token = authHeader.replace('Bearer ', '');

    const user = await User.findById(token);
    if (!user) return next(new NotFoundError('Пользователь не найден'));

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Выход
 * @param req
 * @param res
 * @param next
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) return next(new BadRequestError('Пользователь не найден'));

    const user = await User.findById(refreshToken);
    if (!user) return next(new NotFoundError('Пользователь не найден'));

    res.json({ success: true });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Освежить токен
 * @param req
 * @param res
 * @param next
 */
const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) return next(new UnauthorizedError('Пользователь не найден'));

    const user = await User.findById(refreshToken);
    if (!user) return next(new NotFoundError('Пользователь не найден'));

    res.json({
      success: true,
      user: { name: user.name, email: user.email },
      accessToken: refreshToken,
    });
  } catch (err: any) {
    next(err);
  }
};

export {
  register,
  login,
  user,
  logout,
  refreshAccessToken,
};
