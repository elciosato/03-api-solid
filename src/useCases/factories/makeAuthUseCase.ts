import { PrismaUsersRepository } from "@/repositories/prisma/PrismaUsersRepository";
import { AuthUseCase } from "../AuthUseCase";

export function makeAuthUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authUseCase = new AuthUseCase(usersRepository);

  return authUseCase;
}
