/**
 * Контроллеры для авторизации
 */

import {
  Request,
  Response,
  NextFunction,
} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

import config from '../config';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import ConflictError from '../errors/conflict-error';
import {
  getExpiryInSeconds,
  createTwoTokens,
} from '../utils/auth';

/* Время жизни токенов в секундах */
const accessExpiresInSeconds = getExpiryInSeconds(config.auth.accessExpires as string);
const refreshExpiresInSeconds = getExpiryInSeconds(config.auth.refreshExpires as string);

/**
 * Регистрация
 * @param req  - запрос, данные пользователя
 * @param res  - ответ, 201 и пользователь
 * @param next - следующий обработчик
 */
const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name = 'Ё-мое', email, password } = req.body;

    if (!name || !email || !password) return next(new BadRequestError('Все поля должны быть указаны'));

    const isExistUser = await User.findOne({ email }).select('+tokens');

    if (isExistUser) return next(new ConflictError('Пользователь с таким email уже существует'));

    /* Всё нормально, можно сохранять */
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash, tokens: [],
    });

    /* Всё про токены */
    const { accessToken, refreshToken } = createTwoTokens(
      user._id as unknown as ObjectId,
      accessExpiresInSeconds,
      refreshExpiresInSeconds,
    );
    user.tokens.push({ token: refreshToken });

    await user.save();

    res.cookie('refreshToken', refreshToken, {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: refreshExpiresInSeconds * 1000,
      path: '/',
    });

    res.status(201).json({
      success: true,
      user: { name: user.name, email: user.email, id: user._id },
      accessToken,
    });
  } catch (error: any) {
    return next(error);
  }

  return null;
};

/**
 * Авторизация
 * @param req  - запрос, почта и пароль
 * @param res  - ответ, всё хорошо
 * @param next - следующий обработчик
 */
const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new BadRequestError('Все поля должны быть указаны'));

    const user = await User.findOne({ email }).select('+password +tokens');
    if (!user) return next(new UnauthorizedError('Неверные почта или пароль'));

    const isCompare = await bcrypt.compare(password, user.password);
    if (!isCompare) return next(new UnauthorizedError('Неверные почта или пароль'));

    /* Всё про токены */
    const { accessToken, refreshToken } = createTwoTokens(
      user._id as unknown as ObjectId,
      accessExpiresInSeconds,
      refreshExpiresInSeconds,
    );
    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: refreshExpiresInSeconds * 1000,
      path: '/',
    });

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
      accessToken,
    });
  } catch (error: any) {
    return next(error);
  }

  return null;
};

/**
 * Получить пользователя
 * @param req  - запрос, авторизация
 * @param res  - ответ, всё хорошо
 * @param next - следующий обработчик
 */
const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new UnauthorizedError('Пользователь не авторизован'));

    const token = authHeader.replace('Bearer ', '');
    const payload:any = jwt.verify(token, config.auth.accessSecret as string);

    const user = await User.findById(payload._id);
    if (!user) return next(new NotFoundError('Пользователь не найден'));

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (error: any) {
    return next(error);
  }

  return null;
};

/**
 * Выход
 * @param req  - запрос, токен
 * @param res  - ответ, всё хорошо
 * @param next - следующий обработчик
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) return next(new BadRequestError('Пользователь не найден'));
    const payload:any = jwt.verify(refreshToken, config.auth.refreshSecret as string);

    const user = await User.findById(payload._id).select('+tokens');
    if (!user) return next(new NotFoundError('Пользователь не найден'));

    user.tokens = user.tokens.filter((token) => token.token !== refreshToken);
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: 0,
      path: '/',
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    return next(err);
  }

  return null;
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

    const payload:any = jwt.verify(refreshToken, config.auth.refreshSecret as string);
    const user = await User.findById(payload._id).select('+tokens');
    if (!user) return next(new NotFoundError('Пользователь не найден'));

    const isExistsToken = user.tokens.some((token) => token.token === refreshToken);
    if (!isExistsToken) return next(new UnauthorizedError('Токен не действителен'));

    /* Всё про токены */
    const { accessToken, refreshToken: refreshTokenNew } = createTwoTokens(
      user._id as unknown as ObjectId,
      accessExpiresInSeconds,
      refreshExpiresInSeconds,
    );
    user.tokens = user.tokens.filter((token) => token.token !== refreshToken);
    user.tokens.push({ token: refreshTokenNew });
    await user.save();

    res.cookie('refreshToken', refreshTokenNew, {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: refreshExpiresInSeconds * 1000,
      path: '/',
    });

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email },
      accessToken,
    });
  } catch (err: any) {
    return next(err);
  }

  return null;
};

export {
  register,
  login,
  getUser,
  logout,
  refreshAccessToken,
};
