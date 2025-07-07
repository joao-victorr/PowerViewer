import { LinkUserToEnterpriseService } from "@Application/UseCases/EnterpriseUser/LinkUserToEnterpriseService";
import type { LinkEnterpriseUserDTO, } from "@DTOs/EnterpriseUserDTO";
import type { FastifyReply, FastifyRequest } from "fastify";


export class LinkUserToEnterpriseController {
  async handle(
    request: FastifyRequest<{ Body: LinkEnterpriseUserDTO }>,
    reply: FastifyReply
  ) {
    const { userId, enterpriseId } = request.body;

    const response = await new LinkUserToEnterpriseService().execute({userId, enterpriseId});

    if (response instanceof Error) {
      return reply.code(400).send({ error: response.message });
    }

    return reply.code(201).send(response);
  }
} 