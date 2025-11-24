/**
 * Ошибка 409 - запрос не может быть выполнен из-за конфликта
 * с текущим состоянием ресурса на сервере
 */
import ParentError from './parent-error';

class ConflictError extends ParentError {
  constructor(message: string = 'Такая запись уже есть') {
    super(message, 409);
  }
}

export default ConflictError;
