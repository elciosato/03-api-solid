import { UsersRepository } from "@/repositories/UsersRepository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/UserNotExistError";

interface iGetUserProfileUseCaseRequest {
  id: string;
}

interface iGetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({
    id,
  }: iGetUserProfileUseCaseRequest): Promise<iGetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
