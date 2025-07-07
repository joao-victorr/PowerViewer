import { CreateEnterpriseServices } from "@Application/UseCases/Enterprises/CreateEntepriseServices";
import type { CreateEnterpriseDTO } from "@DTOs/EnterpriseDTO";
import type { FastifyReply, FastifyRequest } from "fastify";

export class CreateEnterpriseController {
  async handle(
    request: FastifyRequest<{ Body: CreateEnterpriseDTO }>,
    reply: FastifyReply
  ) {
    const { name } = request.body;

    const createEnterpriseServices = new CreateEnterpriseServices();
    const result = await createEnterpriseServices.excute({ name });

    if (result instanceof Error) {
      return reply.code(400).send({ error: result.message });
    }

    return reply.code(200).send({ enterpriseId: result });
  }
}
