import { InMemoryGymsRepository } from "@/repositories/inMemory/InMemoryGymsRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./CreateGymUseCase";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: 52.0324103,
      longitude: 4.3600551,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
