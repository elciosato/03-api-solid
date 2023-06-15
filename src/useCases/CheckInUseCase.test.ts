import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./CheckInUseCase";
import { InMemoryCheckInsRepository } from "../repositories/inMemory/InMemoryCheckInsRepository";
import { InMemoryGymsRepository } from "@/repositories/inMemory/InMemoryGymsRepository";
import { MaxDistanceError } from "./errors/MaxDistanceError";
import { MaxNumberOfCheckInsError } from "./errors/MaxNumberOfCheckInsError";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "JavaScript Gym",
      phone: "0000",
      latitude: 52.4977396,
      longitude: 6.4341635,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: 52.4977396,
      userLongitude: 6.4341635,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice on the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: 52.4977396,
      userLongitude: 6.4341635,
    });

    expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: 52.4977396,
        userLongitude: 6.4341635,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: 52.4977396,
      userLongitude: 6.4341635,
    });

    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: 52.4977396,
      userLongitude: 6.4341635,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await gymsRepository.create({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "JavaScript Gym",
      phone: "0000",
      latitude: 52.0324103,
      longitude: 4.3600551,
    });

    expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: 52.4977396,
        userLongitude: 6.4341635,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
