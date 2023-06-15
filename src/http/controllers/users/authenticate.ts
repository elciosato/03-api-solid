import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "@/useCases/errors/InvalidCredentialsError";
import { makeAuthUseCase } from "@/useCases/factories/makeAuthUseCase";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authUserBodySchema.parse(request.body);

  try {
    const authUseCase = makeAuthUseCase();

    const { user } = await authUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        error: err.message,
      });
    }
    return reply.status(500).send({
      error: "Something went wrong",
    });
  }
}
