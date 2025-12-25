import { db } from "../config/database";

const inspect = async () => {
  try {
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
    );
    console.log("\n📊 Database Check:");
    console.log("------------------");

    for (const row of tables.rows) {
      const name = row.name as string;
      const count = await db.execute(`SELECT COUNT(*) as c FROM ${name}`);
      console.log(`- ${name.padEnd(15)} : ${count.rows[0].c} rows`);
    }
    console.log("\n✅ Database is readable.\n");
  } catch (e) {
    console.error("❌ Error reading database:", e);
  }
};

inspect();
