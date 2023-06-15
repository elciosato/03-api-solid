import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createCheckIn } from "./create";
import { validateCheckIn } from "./validate";
import { checkInsHistory } from "./history";
import { getUserMetrics } from "./metrics";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/gyms/:gymId/checkin", createCheckIn);
  app.patch(
    "/checkins/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validateCheckIn
  );
  app.get("/checkins/history", checkInsHistory);
  app.get("/checkins/metrics", getUserMetrics);
}
