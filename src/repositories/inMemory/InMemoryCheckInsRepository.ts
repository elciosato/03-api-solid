import { Prisma, CheckIn } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../CheckInsRepository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private checkInsRepository: CheckIn[] = [];

  async findById(checkInId: string) {
    const checkIn = this.checkInsRepository.find(
      (item) => item.id === checkInId
    );

    if (!checkIn) {
      return null;
    }

    checkIn.validatedAt = new Date();

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkIn = this.checkInsRepository.find((item) => {
      return (
        item.userId === userId &&
        dayjs(item.createdAt).isAfter(startOfTheDay) &&
        dayjs(item.createdAt).isBefore(endOfTheDay)
      );
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkInsRepository
      .filter((item) => {
        return item.userId === userId;
      })
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string) {
    return this.checkInsRepository.filter((item) => {
      return item.userId === userId;
    }).length;
  }
  // async findById(id: string) {
  //   const user = this.checkInsRepository.find((user) => user.id === id) || null;
  //   return user;
  // }

  // async findByEmail(email: string) {
  //   const user =
  //     this.checkInsRepository.find((user) => user.email === email) || null;
  //   return user;
  // }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      createdAt: new Date(),
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
    };
    this.checkInsRepository.push(checkIn);
    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkInsRepository.findIndex(
      (item) => (item.id = checkIn.id)
    );

    if (checkInIndex >= 0) {
      this.checkInsRepository[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
