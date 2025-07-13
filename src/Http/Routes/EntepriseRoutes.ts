
import { CreateEnterpriseController } from "@Controllers/Enterprise/CreateEnterpriseController";
import { GetEnterpriseByIdController } from "@Controllers/Enterprise/GetEnterpriseByIdController";
import { GetEnterprisesController } from "@Controllers/Enterprise/GetEnterprisesController";
import type { FastifyTypedInstance } from "@Types/fastify";
import { EnsureAuthenticated } from "Http/Middlewares/EnsureAuthenticated";
import { z } from "zod";
import {
  CreateEnterpriseSchema,
  GetEnterpriseByIdParamsSchema,
  GetEnterpriseReplySchema,
} from "../../DTOs/EnterpriseDTO";

const getEnterprisesController = new GetEnterprisesController();
const createEnterpriseController = new CreateEnterpriseController();
const getEnterpriseByIdController = new GetEnterpriseByIdController();

export const EnterpriseRoutes = async (server: FastifyTypedInstance) => {
  server.get(
    "/",
    {
      preHandler: EnsureAuthenticated,
      schema: {
        tags: ["Enterprise"],
        summary: "List all enterprises",
        security: [{
          bearerAuth: []
        }],
        response: {
          200: z.array(GetEnterpriseReplySchema),
          404: z.object({ error: z.string() }),
        },
      },
    }, 
    getEnterprisesController.handle
  );

  server.get(
    "/:id",
    {
      preHandler: EnsureAuthenticated, 
      schema: {
        tags: ["Enterprise"],
        summary: "Get an enterprise by ID",
        description: "This endpoint allows you to retrieve an enterprise by its ID.",
        params: GetEnterpriseByIdParamsSchema,
        security: [{
          bearerAuth: []
        }],
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
      preHandler: EnsureAuthenticated,
      schema: {
        tags: ["Enterprise"],
        summary: "Create a new enterprise",
        description: "This endpoint allows you to create a new enterprise in the system.",
        security: [{
          bearerAuth: []
        }],
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
