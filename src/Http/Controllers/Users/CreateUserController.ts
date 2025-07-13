
import type { CreateUsersDTO } from "@DTOs/UsersDTO";
import { CreateUserService } from "@UseCases/Users/CreateUserService";
import type { FastifyReply, FastifyRequest } from "fastify";



export class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = request.body as CreateUsersDTO;

    const createUserService = new CreateUserService();

    const result = await createUserService.execute({
      name,
      email,
      password,
    });

    if (result instanceof Error) {
      return reply.status(400).send(result.message);
    }

    return reply.status(201).send(result);
  }
}