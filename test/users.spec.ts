import { execSync } from "node:child_process";
import { afterAll, beforeAll, beforeEach, describe, test } from "vitest";
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
        senha: "example",
      })
      .expect(201);
  });
});
