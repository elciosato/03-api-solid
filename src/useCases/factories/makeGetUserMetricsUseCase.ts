import { PrismaCheckInsRepository } from "@/repositories/prisma/PrismaCheckInsRepository";
import { GetUserMetricsUseCase } from "../GetUserMetricsUseCase";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUserMetricsUseCase(checkInsRepository);

  return useCase;
}
