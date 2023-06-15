import { PrismaUsersRepository } from "@/repositories/prisma/PrismaUsersRepository";
import { RegisterUseCase } from "../RegisterUseCase";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}
