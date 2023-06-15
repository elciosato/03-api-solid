import { PrismaCheckInsRepository } from "@/repositories/prisma/PrismaCheckInsRepository";
import { PrismaGymsRepository } from "@/repositories/prisma/PrismaGymsRepository";
import { CheckInUseCase } from "../CheckInUseCase";

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);

  return useCase;
}
