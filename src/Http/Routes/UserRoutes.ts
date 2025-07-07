import { CreateUserController } from "@Controllers/Users/CreateUserController";
import { CreateUsersSchema, GetUserByIdParamsSchema } from "@DTOs/UsersDTO";
import type { FastifyTypedInstance } from "@Types/fastify";


const createUserController = new CreateUserController();


export const UserRoutes = async (server: FastifyTypedInstance) => {
  server.get('/', {
    schema: {
      tags: ["Users"]
      
    },
    handler: async (_request, _replyy) => {
      // Logic to get users
      return { message: 'List of users' };
    }
  })

  server.post(
    '/',
    {
      schema: {
        tags: ['Users'],
        summary: 'Create a new user',
        description: 'This endpoint allows you to create a new user in the system.',
        body: CreateUsersSchema,
        response: {
          201: GetUserByIdParamsSchema
        }
      }
    }, 
    createUserController.handle
  );
}
