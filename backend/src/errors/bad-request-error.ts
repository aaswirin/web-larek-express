/**
 * Ошибка 400 - неверный запрос
 */
import ParentError from './parent-error';

class BadRequestError extends ParentError {
  constructor(message: string = 'Ошибка в запросе') {
    super(message, 400);
  }
}

export default BadRequestError;
