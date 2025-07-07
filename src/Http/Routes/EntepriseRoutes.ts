
import { CreateEnterpriseController } from "@Controllers/Enterprise/CreateEnterpriseController";
import { GetEnterpriseByIdController } from "@Controllers/Enterprise/GetEnterpriseByIdController";
import type { FastifyTypedInstance } from "@Types/fastify";
import { z } from "zod";
import {
  CreateEnterpriseSchema,
  GetEnterpriseByIdParamsSchema,
  GetEnterpriseReplySchema,
} from "../../DTOs/EnterpriseDTO";

const createEnterpriseController = new CreateEnterpriseController();
const getEnterpriseByIdController = new GetEnterpriseByIdController();

export const EnterpriseRoutes = async (server: FastifyTypedInstance) => {
  server.get(
    "/",
    {
      schema: {
        tags: ["Enterprise"],
        summary: "List all enterprises",
        response: {
          200: z.object({ message: z.string() }),
        },
      },
    },
    async () => {
      return { message: "List of enterprises" };
    }
  );

  server.get(
    "/:id",
    { 
      schema: {
        tags: ["Enterprise"],
        summary: "Get an enterprise by ID",
        description: "This endpoint allows you to retrieve an enterprise by its ID.",
        params: GetEnterpriseByIdParamsSchema,
        response: {
          200: GetEnterpriseReplySchema,
          404: z.object({ error: z.string() }),
        },
      },
    },
    getEnterpriseByIdController.handle
  );

  server.post(
    "/",
    {
      schema: {
        tags: ["Enterprise"],
        summary: "Create a new enterprise",
        description: "This endpoint allows you to create a new enterprise in the system.",
        body: CreateEnterpriseSchema,
        response: {
          201: z.object({ enterpriseId: z.string() }),
          400: z.object({ error: z.string() }),
        },
      },
    },
    createEnterpriseController.handle
  );
};
