import { PrismaGymsRepository } from "@/repositories/prisma/PrismaGymsRepository";
import { CreateGymUseCase } from "../CreateGymUseCase";

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(gymsRepository);

  return useCase;
}
