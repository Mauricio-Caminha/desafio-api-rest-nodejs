import { execSync } from "node:child_process";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import request from "supertest";

import { app } from "../src/app";

describe("Users routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  test("Should be able to create a new user", async () => {
    await request(app.server)
      .post("/users")
      .send({
        email: "example@email.com",
        nome: "Example",
        senha: "example",
      })
      .expect(201);
  });

  test("Should be able to get user metrics", async () => {
    const createUserResponse = await request(app.server).post("/users").send({
      email: "example@email.com",
      nome: "Example",
      senha: "example",
    });

    const cookies = createUserResponse.get("Set-Cookie") ?? [];

    const getUserMetricsResponse = await request(app.server)
      .get("/users/user")
      .set("Cookie", cookies)
      .expect(200);

    expect(getUserMetricsResponse.body.user).toEqual({
      nome: "Example",
      total_refeicoes: 0,
      qtd_refeicoes_dentro_dieta: 0,
      qtd_refeicoes_fora_dieta: 0,
      sequencia_refeicoes: 0,
    });
  });
});
