import { GetUsersFromEnterpriseServices } from "@Application/Services/EnterpriseUser/GetUsersFromEnterpriseServices";
import type { GetUsersFromEnterpriseResponseDTO } from "@DTOs/EnterpriseUserDTO";
import type { FastifyReply, FastifyRequest } from "fastify";

export class GetUsersFromEnterpriseController {
  async handle(
    request: FastifyRequest<{ Params: { enterpriseId: string } }>,
    reply: FastifyReply
  ): Promise<GetUsersFromEnterpriseResponseDTO[] | { error: string }> {
    const { enterpriseId } = request.params;

    const usersFromEnterprise = await new GetUsersFromEnterpriseServices().execute({ enterpriseId });

    if (usersFromEnterprise instanceof Error) {
      return reply.status(400).send({ error: usersFromEnterprise.message });
    }

    return reply.status(200).send(usersFromEnterprise);
    
  }
}