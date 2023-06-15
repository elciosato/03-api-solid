import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/inMemory/InMemoryCheckInsRepository";
import { ValidateCheckInUseCase } from "./ValidateCheckInUseCase";
import { ResourceNotFoundError } from "./errors/UserNotExistError";
import { LateCheckInValidationError } from "./errors/LateCheckInValidationError";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
    // expect(checkInsRepository.checkInRepository[0].validatedAt).toEqual(expect.any(Date))
  });

  it("should not be able to validate an inexistent check-in", async () => {
    // vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    expect(async () => {
      await sut.execute({
        checkInId: "Invalid ID",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const createdCheckIn = await checkInsRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      });
    }).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
