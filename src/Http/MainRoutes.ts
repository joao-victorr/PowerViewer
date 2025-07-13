
import { AuthRoutes } from "@Routes/AuthRoutes";
import { EnterpriseUserRouter } from "@Routes/EnterpriseUserRoutes";
import type { FastifyTypedInstance } from "@Types/fastify";
import { EnterpriseRoutes } from "./Routes/EntepriseRoutes";
import { UserRoutes } from "./Routes/UserRoutes";



export const Routes = async (server: FastifyTypedInstance) => {
  await server.register(AuthRoutes, { prefix: '/auth' });
  await server.register(EnterpriseRoutes, { prefix: '/enterprises' });
  await server.register(UserRoutes, { prefix: '/users' });
  await server.register(EnterpriseUserRouter, { prefix: '/enterprise-users' });


}