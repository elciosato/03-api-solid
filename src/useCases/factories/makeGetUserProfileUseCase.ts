import { PrismaUsersRepository } from "@/repositories/prisma/PrismaUsersRepository";
import { GetUserProfileUseCase } from "../GetUserProfileUseCase";

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);

  return useCase;
}
