import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const userSchema = z.object({
      email: z.string().email(),
      nome: z.string().min(3),
      senha: z.string().min(3),
    });

    const { email, nome, senha } = userSchema.parse(request.body);

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
      nome,
      senha,
      session_id,
    });

    reply.status(201).send();
  });

  app.get(
    "/user",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const session_id = request.cookies.session_id;

      const user = await knex("users")
        .select(
          "nome",
          "total_refeicoes",
          "qtd_refeicoes_dentro_dieta",
          "qtd_refeicoes_fora_dieta",
          "sequencia_refeicoes"
        )
        .where({ session_id })
        .first();

      if (!user) {
        reply.status(404).send();
        return;
      }

      reply.send({ user });
    }
  );

  app.post(
    "/user/meal",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const session_id = request.cookies.session_id;

      const mealSchema = z.object({
        nome: z.string().min(3),
        descricao: z.string().min(3),
        dentro_da_dieta: z.boolean(),
      });

      const { nome, descricao, dentro_da_dieta } = mealSchema.parse(
        request.body
      );

      const user = await knex("users")
        .select("id")
        .where({ session_id })
        .first();

      if (!user) {
        reply.status(404).send();
        return;
      }

      await knex("meals").insert({
        id: randomUUID(),
        user_id: user.id,
        nome,
        descricao,
        data_hora: knex.fn.now(),
        esta_dentro_da_dieta: dentro_da_dieta,
      });

      reply.status(201).send();
    }
  );
}
