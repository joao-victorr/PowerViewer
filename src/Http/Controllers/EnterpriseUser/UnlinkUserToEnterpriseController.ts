
import { UnlinkUserToEnterpriseService } from "@Application/Services/EnterpriseUser/UnlinkUserToEnterpriseService";
import type { LinkEnterpriseUserDTO, } from "@DTOs/EnterpriseUserDTO";
import type { FastifyReply, FastifyRequest } from "fastify";


export class UnlinkUserToEnterpriseController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, enterpriseId } = request.body as LinkEnterpriseUserDTO;

    const response = await new UnlinkUserToEnterpriseService().execute({userId, enterpriseId});

    if (response instanceof Error) {
      return reply.code(400).send({ error: response.message });
    }

    return reply.code(201).send();
  }
} 