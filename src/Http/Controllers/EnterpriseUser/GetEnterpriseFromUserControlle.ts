
import { GetEnterpriseFromUserService } from "@Application/UseCases/EnterpriseUser/GetEnterpriseFromUserService";
import type { FastifyReply, FastifyRequest } from "fastify";


export class GetEnterpriseFromUserController {
  async handle(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params;

    // Simulate fetching enterprises from a service
    const enterprisesFromUser = await new GetEnterpriseFromUserService().execute({ userId });

    if (enterprisesFromUser instanceof Error) {
      return reply.code(400).send({ error: enterprisesFromUser.message });
    }

    return reply.code(200).send(enterprisesFromUser);
  }
} 