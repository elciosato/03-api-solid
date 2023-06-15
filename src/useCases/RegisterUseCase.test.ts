import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./RegisterUseCase";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/inMemory/InMemoryUsersRepository";
import { UserAlreadyExistError } from "./errors/UserAlreadyExistError";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isValidPasswordHash = await compare("123456", user.passwordHash);

    expect(isValidPasswordHash).toBe(true);
  });

  it("should not be able register a user with same email twice", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    await sut.execute(user);

    expect(async () => {
      await sut.execute(user);
    }).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
