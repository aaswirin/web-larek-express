import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';

const ACCESS_SECRET = process.env.AUTH_ACCESS_TOKEN_SECRET!;

const auth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new UnauthorizedError('Пользователь не авторизован'));

    const token = authHeader.replace('Bearer ', '');

    (req as any).user = jwt.verify(token, ACCESS_SECRET);

    return next();
  } catch (error: any) {
    return next(new UnauthorizedError('Недействительный или просроченный токен'));
  }
};

export default auth;
