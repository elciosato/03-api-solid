import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../GymsRepository";
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime";
import { getDistanceBetweenCoordinates } from "@/utils/getDistanceBetweenCoordinates";

export class InMemoryGymsRepository implements GymsRepository {
  private gymsRepository: Gym[] = [];

  async findById(id: string) {
    const gym = this.gymsRepository.find((gym) => gym.id === id) || null;
    return gym;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.gymsRepository.filter((item) => {
      const distance = getDistanceBetweenCoordinates(params, {
        latitude: item.latitude.toNumber(),
        longitude: item.longitude.toNumber(),
      });

      return distance <= 10;
    });
  }

  async searchMany(query: string, page: number) {
    return this.gymsRepository
      .filter((item) => {
        return item.title.includes(query);
      })
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Decimal(String(data.latitude)),
      longitude: new Decimal(String(data.longitude)),
      phone: data.phone ?? null,
    };
    this.gymsRepository.push(gym);
    return gym;
  }
}
