import { GetEnterprisesService } from "@Application/Services/Enterprises/GetEnterpriseService";
import type { FastifyReply, FastifyRequest, } from "fastify";

export class GetEnterprisesController {
  async handle( _request: FastifyRequest, reply: FastifyReply ) {
    
    const service = new GetEnterprisesService();

    const enterprises = await service.execute();

    if(enterprises instanceof Error) {
      return reply.code(404).send({ error: enterprises.message })
    }

    return reply.code(200).send(enterprises)

  }
}