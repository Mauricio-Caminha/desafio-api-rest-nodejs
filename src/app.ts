import fastify from "fastify";
import cookie from "@fastify/cookie";

import { dietRoutes } from "routes/diet";

export const app = fastify();

app.register(cookie);

app.addHook("preHandler", async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(dietRoutes, {
  prefix: "/diet",
});
