import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/inMemory/InMemoryCheckInsRepository";
import { GetUserMetricsUseCase } from "./GetUserMetricsUseCase";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Count User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get user check-ins count", async () => {
    await checkInsRepository.create({
      userId: "user-01",
      gymId: "gym-01",
    });

    await checkInsRepository.create({
      userId: "user-01",
      gymId: "gym-02",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
