import { PrismaGymsRepository } from "@/repositories/prisma/PrismaGymsRepository";
import { SearchGymUseCase } from "../SearchGymsUseCase";

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
}
