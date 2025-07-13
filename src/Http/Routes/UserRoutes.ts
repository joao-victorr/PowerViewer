import { CreateUserController } from "@Controllers/Users/CreateUserController";
import { GetusersController } from "@Controllers/Users/GetusersController";
import { CreateUsersSchema, GetUserByIdParamsSchema, GetUsersReplySchema } from "@DTOs/UsersDTO";
import type { FastifyTypedInstance } from "@Types/fastify";
import { EnsureAuthenticated } from "Http/Middlewares/EnsureAuthenticated";
import z from "zod";


const getusersController = new GetusersController()
const createUserController = new CreateUserController();


export const UserRoutes = async (server: FastifyTypedInstance) => {
  server.get('/', 
    {
      preHandler: EnsureAuthenticated,
      schema: {
        tags: ["Users"],
        description: "List all users",
        security: [{
          bearerAuth: []
        }],
        response: {
          200: z.array(GetUsersReplySchema)
        }
      },
    },
    getusersController.handle
  )

  server.post(
    '/',
    {
      preHandler: EnsureAuthenticated,
      schema: {
        tags: ['Users'],
        summary: 'Create a new user',
        description: 'This endpoint allows you to create a new user in the system.',
        security: [{
          bearerAuth: []
        }],
        body: CreateUsersSchema,
        response: {
          201: GetUserByIdParamsSchema
        }
      }
    }, 
    createUserController.handle
  );
}
