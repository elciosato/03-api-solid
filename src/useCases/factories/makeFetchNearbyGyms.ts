import { PrismaGymsRepository } from "@/repositories/prisma/PrismaGymsRepository";
import { FetchNearbyGymsUseCase } from "../FetchNearbyGyms";

export function makeFetchNearbyGyms() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);

  return useCase;
}
