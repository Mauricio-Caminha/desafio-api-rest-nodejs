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

  test("Should be able to create a new meal", async () => {
    const createUserResponse = await request(app.server).post("/users").send({
      email: "example@email.com",
      nome: "Example",
      senha: "example",
    });

    const cookies = createUserResponse.get("Set-Cookie") ?? [];

    await request(app.server)
      .post("/users/user/meal")
      .set("Cookie", cookies)
      .send({
        nome: "Example meal",
        descricao: "Example description",
        dentro_da_dieta: true,
      })
      .expect(201);
  });

  test("Should be able to get all meals of the current user", async () => {
    const createUserResponse = await request(app.server).post("/users").send({
      email: "example@email.com",
      nome: "Example",
      senha: "example",
    });

    const cookies = createUserResponse.get("Set-Cookie") ?? [];

    await request(app.server)
      .post("/users/user/meal")
      .set("Cookie", cookies)
      .send({
        nome: "Example meal",
        descricao: "Example description",
        dentro_da_dieta: true,
      })
      .expect(201);

    const getMealsResponse = await request(app.server)
      .get("/users/user/meals")
      .set("Cookie", cookies)
      .expect(200);

    expect(getMealsResponse.body.meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          nome: expect.any(String),
          descricao: expect.any(String),
          data_hora: expect.any(String),
          esta_dentro_da_dieta: expect.any(Number),
          user_id: expect.any(String),
        }),
      ])
    );
  });

  test("Should be able to get a meal of the current user by id", async () => {
    const createUserResponse = await request(app.server).post("/users").send({
      email: "example@email.com",
      nome: "Example",
      senha: "example",
    });

    const cookies = createUserResponse.get("Set-Cookie") ?? [];

    await request(app.server)
      .post("/users/user/meal")
      .set("Cookie", cookies)
      .send({
        nome: "Example meal",
        descricao: "Example description",
        dentro_da_dieta: true,
      })
      .expect(201);

    const getMealsResponse = await request(app.server)
      .get("/users/user/meals")
      .set("Cookie", cookies)
      .expect(200);

    const mealId = getMealsResponse.body.meals[0].id;

    const mealResponse = await request(app.server)
      .get(`/users/user/meal/${mealId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(mealResponse.body.meal).toEqual([
      {
        id: mealId,
        user_id: expect.any(String),
        nome: "Example meal",
        descricao: "Example description",
        data_hora: expect.any(String),
        esta_dentro_da_dieta: expect.any(Number),
      },
    ]);
  });

  test("Should be able to delete a meal of the current user by id", async () => {
    const createUserResponse = await request(app.server).post("/users").send({
      email: "example@email.com",
      nome: "Example",
      senha: "example",
    });

    const cookies = createUserResponse.get("Set-Cookie") ?? [];

    await request(app.server)
      .post("/users/user/meal")
      .set("Cookie", cookies)
      .send({
        nome: "Example meal",
        descricao: "Example description",
        dentro_da_dieta: true,
      })
      .expect(201);

    const getMealsResponse = await request(app.server)
      .get("/users/user/meals")
      .set("Cookie", cookies)
      .expect(200);

    const mealId = getMealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/users/user/meal/${mealId}`)
      .set("Cookie", cookies)
      .expect(204);
  });
});
