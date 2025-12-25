import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  TURSO_DATABASE_URL: z.string(), // Accepts 'libsql://' or 'file:'
  TURSO_AUTH_TOKEN: z.string().optional(),
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  API_SECRET: z.string().min(10).optional(), // Optional for dev, required for prod ideally
});

export type EnvConfig = z.infer<typeof envSchema>;
