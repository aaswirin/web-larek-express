/**
 * Ошибка 409 - запрос не может быть выполнен из-за конфликта
 * с текущим состоянием ресурса на сервере
 */

class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictError;
