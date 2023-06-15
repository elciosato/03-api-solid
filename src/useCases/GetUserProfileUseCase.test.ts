import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/inMemory/InMemoryUsersRepository";
import { GetUserProfileUseCase } from "./GetUserProfileUseCase";
import { ResourceNotFoundError } from "./errors/UserNotExistError";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get a user profile", async () => {
    const email = "johndoe@example.com";
    const password = "123456";

    const newUser = await usersRepository.create({
      name: "John Doe",
      email,
      passwordHash: await hash(password, 6),
    });

    const { user } = await sut.execute({
      id: newUser.id,
    });

    expect(user.id).toEqual(newUser.id);
  });

  it("should not be able to get a user profile with wrong id", async () => {
    expect(async () => {
      await sut.execute({
        id: "dklfjsljjldkfjklsdjfkljsdklj",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
