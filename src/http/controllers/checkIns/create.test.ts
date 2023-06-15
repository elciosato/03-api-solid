import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/createAndAuthenticateUser";
import { prisma } from "@/lib/prisma";

describe("Create CheckIn (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a checkin", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: 52.0324103,
        longitude: 4.3600551,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/checkin`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: 52.0324103,
        longitude: 4.3600551,
      });

    expect(response.statusCode).toEqual(201);
  });
});
