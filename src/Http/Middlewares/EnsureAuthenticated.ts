import { verifyToken } from "@Infrastructure/Auth/JWT";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function EnsureAuthenticated(req: FastifyRequest, reply: FastifyReply) {

  console.log(req.headers.authorization)

  console.error("EnsureAuthenticated middleware called");
  const authHeader = req.headers.authorization;
  console.error("Authorization header:", authHeader);
  console.log("Authorization header:", authHeader);
  const token = authHeader?.split(" ")[1];

  if (!token) return reply.code(401).send({ error: "Token missing" });

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
  } catch {
    return reply.code(401).send({ error: "Invalid token" });
  }
}
