import { LinkUserToEnterpriseController } from "@Controllers/EnterpriseUser/LinkUserToEnterpriseController";
import { LinkEnterpriseUserResponseSchema, LinkEnterpriseUserSchema } from "@DTOs/EnterpriseUserDTO";
import type { FastifyTypedInstance } from "@Types/fastify";


const linkUserToEnterpriseController = new LinkUserToEnterpriseController(); 

export const EnterpriseUserRouter = async (server: FastifyTypedInstance) => {

  server.post(
    "/",
    {
      schema: {
        tags: ["Enterprise User"],
        description: "Link a user to an enterprise",
        summary: "Link User to Enterprise",
        operationId: "linkUserToEnterprise",
        body: LinkEnterpriseUserSchema,
        response: {
          201: LinkEnterpriseUserResponseSchema
        }
      }
    },
    linkUserToEnterpriseController.handle
  );
}