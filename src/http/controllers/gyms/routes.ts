import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createGym } from "./create";
import { searchGyms } from "./search";
import { nearbyGyms } from "./nearby";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, createGym);
  app.get("/gyms/search", searchGyms);
  app.get("/gyms/nearby", nearbyGyms);
}
