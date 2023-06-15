import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/GymsRepository";

interface iFetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface iFetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: iFetchNearbyGymsUseCaseRequest): Promise<iFetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
