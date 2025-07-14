import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "./AppErrors";

export const ErrorsHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const logger = request.server.log;

  if (error instanceof AppError) {
    logger.error(`AppError [${error.statusCode}]: ${error.message}`);
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    });
  } else {
    logger.error(`Erro inesperado: ${error.message}`, error);
    reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Ocorreu um erro interno no servidor.',
    });
  }
};
