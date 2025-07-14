

import { GetUsersService } from "@Application/Services/Users/GetUsersService";
import type { FastifyReply, FastifyRequest } from "fastify";

export class GetusersController {
  async handle( _request: FastifyRequest, reply: FastifyReply ) {
    

    const service = new GetUsersService()
    const users = await service.execute()

    if(users instanceof Error) {
      return reply.code(400).send({ error: users.message })
    }

    return reply.code(200).send(users);
  }
}