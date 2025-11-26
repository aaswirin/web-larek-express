/**
 * Ошибка 404 - страница не найдена
 */
import ParentError from './parent-error';

class NotFoundError extends ParentError {
  constructor(message: string = 'Страница не найдена') {
    super(message, 404);
  }
}

export default NotFoundError;
