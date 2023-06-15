import { InMemoryGymsRepository } from "@/repositories/inMemory/InMemoryGymsRepository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymUseCase } from "./SearchGymsUseCase";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("should be able to search gyms", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: 52.0324103,
      longitude: 4.3600551,
    });

    await gymsRepository.create({
      title: "TypeScript Gym",
      description: null,
      phone: null,
      latitude: 52.0324103,
      longitude: 4.3600551,
    });

    const { gyms } = await sut.execute({ query: "JavaScript", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to search paginated gyms", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym-${i}`,
        description: null,
        phone: null,
        latitude: 52.0324103,
        longitude: 4.3600551,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym-21" }),
      expect.objectContaining({ title: "JavaScript Gym-22" }),
    ]);
  });
});
