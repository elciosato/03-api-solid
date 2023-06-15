import { PrismaCheckInsRepository } from "@/repositories/prisma/PrismaCheckInsRepository";
import { FetchUserCheckInsHistoryUseCase } from "../FetchUserCheckInsHistory";

export function makeFetchUserCheckInsHistory() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

  return useCase;
}
