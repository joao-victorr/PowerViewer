// src/Domain/Errors/AppErrors.ts

export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'; // Adicionado para melhor depuração
    Object.setPrototypeOf(this, AppError.prototype); // Garante a cadeia de protótipos
  }
};

export class BadRequestError extends AppError { // Nome corrigido
  constructor(message: string = 'Requisição inválida.') { // Adicionado default message
    super(message, 400)
    this.name = 'BadRequestError'; // Adicionado
    Object.setPrototypeOf(this, BadRequestError.prototype); // Adicionado
  }
};

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado.') { // Adicionado default message
    super(message, 404)
    this.name = 'NotFoundError'; // Adicionado
    Object.setPrototypeOf(this, NotFoundError.prototype); // Adicionado
  }
};

export class UnauthorizedError extends AppError { // Nome corrigido
  constructor(message: string = 'Não autorizado.') { // Adicionado default message
    super(message, 401)
    this.name = 'UnauthorizedError'; // Adicionado
    Object.setPrototypeOf(this, UnauthorizedError.prototype); // Adicionado
  }
};

// Exemplo de um erro 403 Forbidden, se precisar
export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado.') {
    super(message, 403);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}