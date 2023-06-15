import { beforeEach, describe, expect, it } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/inMemory/InMemoryUsersRepository";
import { AuthUseCase } from "./AuthUseCase";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";

let usersRepository: InMemoryUsersRepository;
let sut: AuthUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthUseCase(usersRepository);
  });
  it("should be able to authenticate", async () => {
    const email = "johndoe@example.com";
    const password = "123456";

    await usersRepository.create({
      name: "John Doe",
      email,
      passwordHash: await hash(password, 6),
    });

    const { user } = await sut.execute({
      email,
      password,
    });

    const isValidPasswordHash = await compare(password, user.passwordHash);

    expect(isValidPasswordHash).toBe(true);
  });

  it("should not be able to authenticate with wrong email", async () => {
    const email = "johndoe@example.com";
    const password = "123456";

    expect(async () => {
      await sut.execute({
        email,
        password,
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const email = "johndoe@example.com";
    const password = "123456";

    await usersRepository.create({
      name: "John Doe",
      email,
      passwordHash: await hash(password, 6),
    });

    expect(async () => {
      await sut.execute({
        email,
        password: "1234567",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
