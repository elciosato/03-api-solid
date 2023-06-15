import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExistError } from "@/useCases/errors/UserAlreadyExistError";
import { makeRegisterUseCase } from "@/useCases/factories/makeRegisterUseCase";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = createUserBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistError) {
      return reply.status(409).send({
        error: err.message,
      });
    }
    return reply.status(500).send({
      error: "Something went wrong",
    });
  }

  return reply.status(201).send();
}
