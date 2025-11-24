/**
 * Ошибка 401 - не авторизован
 */
import ParentError from './parent-error';

class UnauthorizedError extends ParentError {
  constructor(message: string = 'Пользователь не авторизирован') {
    super(message, 404);
  }
}

export default UnauthorizedError;
