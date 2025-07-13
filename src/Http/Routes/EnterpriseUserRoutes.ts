import { GetEnterpriseFromUserController } from "@Controllers/EnterpriseUser/GetEnterpriseFromUserControlle";
import { GetUsersFromEnterpriseController } from "@Controllers/EnterpriseUser/GetUsersFromEnterpriseController";
import { LinkUserToEnterpriseController } from "@Controllers/EnterpriseUser/LinkUserToEnterpriseController";
import { UnlinkUserToEnterpriseController } from "@Controllers/EnterpriseUser/UnlinkUserToEnterpriseController";
import { GetEnterpriseFromUserResponseSchema, GetUsersFromEnterpriseResponseSchema, LinkEnterpriseUserSchema } from "@DTOs/EnterpriseUserDTO";
import type { FastifyTypedInstance } from "@Types/fastify";
import { EnsureAuthenticated } from "Http/Middlewares/EnsureAuthenticated";
import z from "zod";


const linkUserToEnterpriseController = new LinkUserToEnterpriseController(); 
const unlinkUserToEnterpriseController = new UnlinkUserToEnterpriseController();
const getEnterpriseFromUserController = new GetEnterpriseFromUserController();
const getUsersFromEnterpriseController = new GetUsersFromEnterpriseController(); 


export const EnterpriseUserRouter = async (server: FastifyTypedInstance) => {

  server.post(
    "/",
    {
      preHandler: EnsureAuthenticated,
      schema: {
        tags: ["Enterprise User"],
        description: "Link a user to an enterprise",
        summary: "Link User to Enterprise",
        operationId: "LinkUserToEnterprise",
        security: [{
          bearerAuth: []
        }],
        body: LinkEnterpriseUserSchema,
        response: {
          201: z.null()
        }
      }
    },
    linkUserToEnterpriseController.handle
  );

  server.delete(
    "/",
    {
      preHandler: EnsureAuthenticated,
      schema: {
        tags: ["Enterprise User"],
        description: "Unlink a user to an enterprise",
        summary: "Unlink User to Enterprise",
        operationId: "UnlinkUserToEnterprise",
        security: [{
          bearerAuth: []
        }],
        body: LinkEnterpriseUserSchema,
        response: {
          201: z.null(),
          400: z.object({ error: z.string() })
        }
      }
    },
    unlinkUserToEnterpriseController.handle
  );

  server.get(
    "/users/:userId",
    {
      schema: {
        tags: ["Enterprise User"],
        description: "Get enterprises from a user",
        summary: "Get Enterprises from User",
        operationId: "GetEnterprisesFromUser",
        security: [{
          bearerAuth: []
        }],
        params: z.object({
          userId: z.string().cuid()
        }),
        response: {
          200: z.array(GetEnterpriseFromUserResponseSchema)
        }
      }
    },
    getEnterpriseFromUserController.handle
  );

  server.get(
    "/enterprises/:enterpriseId",
    {
      schema: {
        tags: ["Enterprise User"],
        description: "Get users from an enterprise",
        summary: "Get Users from an Enterprise",
        operationId: "GetUsersFromEnterprise",
        security: [{
          bearerAuth: []
        }],
        params: z.object({
          enterpriseId: z.string().cuid()
        }),
        response: {
          200: z.array(GetUsersFromEnterpriseResponseSchema),
          400: z.object({ error: z.string() })
        }
      }
    },
    getUsersFromEnterpriseController.handle
  );


  
}