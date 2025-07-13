import { AuthenticateUserController } from "@Controllers/Auth/AuthenticateUserController";
import { AuthenticateUserResponseSchema, AuthenticateUserSchema } from "@DTOs/AuthDTO";
import type { FastifyTypedInstance } from "@Types/fastify";

const controller = new AuthenticateUserController();

export const AuthRoutes = async (server: FastifyTypedInstance) => {
  server.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        body: AuthenticateUserSchema,
        response: {
          200: AuthenticateUserResponseSchema
        }
      }
    },
    controller.handle
  );
};
