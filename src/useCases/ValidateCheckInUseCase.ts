import { CheckInsRepository } from "@/repositories/CheckInsRepository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/UserNotExistError";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/LateCheckInValidationError";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const diffInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      "minute"
    );

    if (diffInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validatedAt = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
