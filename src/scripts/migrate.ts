import { initDB } from "../config/database";

const run = async () => {
  console.log("[INFO] Running database migrations...");
  try {
    await initDB();
    console.log("[INFO] Migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("[ERROR] Migration failed:", error);
    process.exit(1);
  }
};

run();
