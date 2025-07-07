import { GetEnterpriseByIdService } from "@Application/UseCases/Enterprises/GetEnterpriseByIdService";
import type { GetEnterpriseByIdParamsDTO } from "@DTOs/EnterpriseDTO";
import type { FastifyReply, FastifyRequest } from "fastify";



export class GetEnterpriseByIdController {
  async handle(
    request: FastifyRequest<{
      Params: GetEnterpriseByIdParamsDTO;
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    const response = await new GetEnterpriseByIdService().execute(id);

    if (response instanceof Error) {
      return reply.status(404).send({ error: response.message });
    }

    return reply.status(200).send(response);
  }
}