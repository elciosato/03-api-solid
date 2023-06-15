import { User, Prisma } from "@prisma/client";
import { UsersRepository } from "../UsersRepository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UsersRepository {
  private usersRepository: User[] = [];

  async findById(id: string) {
    const user = this.usersRepository.find((user) => user.id === id) || null;
    return user;
  }

  async findByEmail(email: string) {
    const user =
      this.usersRepository.find((user) => user.email === email) || null;
    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    };
    this.usersRepository.push(user);
    return user;
  }
}
