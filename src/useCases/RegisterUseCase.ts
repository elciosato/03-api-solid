import { UsersRepository } from "@/repositories/UsersRepository";
import { hash } from "bcryptjs";
import { UserAlreadyExistError } from "./errors/UserAlreadyExistError";
import { User } from "@prisma/client";

interface iRegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface iRegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    name,
    email,
    password,
  }: iRegisterUseCaseRequest): Promise<iRegisterUseCaseResponse> {
    const userExist = await this.usersRepository.findByEmail(email);

    if (userExist) {
      throw new UserAlreadyExistError();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    });

    return { user };
  }
}
