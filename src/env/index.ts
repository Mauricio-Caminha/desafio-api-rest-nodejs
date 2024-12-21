import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test"]).default("development"),
  DATABASE_CLIENT: z.enum(["sqlite3"]).default("sqlite3"),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3000),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("⚠️\tInvalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables!");
}

export const env = _env.data;