import { UsersRepository } from "@/repositories/UsersRepository";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthUseCaseRequest {
  email: string;
  password: string;
}

interface AuthUseCaseResponse {
  user: User;
}

export class AuthUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    email,
    password,
  }: AuthUseCaseRequest): Promise<AuthUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.passwordHash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
