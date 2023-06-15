import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/GymsRepository";

interface iSearchGymUseCaseRequest {
  query: string;
  page: number;
}

interface iSearchGymUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: iSearchGymUseCaseRequest): Promise<iSearchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
