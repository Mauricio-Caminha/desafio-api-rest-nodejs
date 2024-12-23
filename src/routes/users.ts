import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const userSchema = z.object({
      email: z.string().email(),
      senha: z.string().min(3),
    });

    const { email, senha } = userSchema.parse(request.body);

    let session_id = request.cookies.session_id;
    if (!session_id) {
      session_id = randomUUID();
      reply.setCookie("session_id", session_id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    await knex("users").insert({
      id: randomUUID(),
      email,
      senha,
      session_id,
    });

    reply.status(201).send();
  });
}
