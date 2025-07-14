import { AuthenticateUserService } from "@Application/Services/Auth/AuthenticateUserService";
import type { AuthenticateUserDTO } from "@DTOs/AuthDTO";
import type { FastifyReply, FastifyRequest } from "fastify";

export class AuthenticateUserController {
  async handle(
    request: FastifyRequest<{ Body: AuthenticateUserDTO }>,
    reply: FastifyReply
  ) {
    const service = new AuthenticateUserService();
    const result = await service.execute(request.body);
    return reply.code(200).send(result);
  }
}
