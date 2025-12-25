import { createClient } from "@libsql/client";
import { env } from "./env";
import * as tables from "../tables/all";

const url = env.TURSO_DATABASE_URL || "file:local.db";
const authToken = url.startsWith("file:") ? undefined : env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken,
});

export const initDB = async () => {
  try {
    await db.execute(tables.usersTable);
    await db.execute(tables.apiKeysTable);
    await db.execute(tables.oauthTokensTable);
    await db.execute(tables.itemsTable);
  } catch (error) {
    console.error("Failed to init DB tables", error);
  }
};
