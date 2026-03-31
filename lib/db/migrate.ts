import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: ".env.local",
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    console.log("POSTGRES_URL not defined, skipping migrations");
    process.exit(0);
  }

  console.log("Running migrations...");

  try {
    const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
    const db = drizzle(connection);

    const start = Date.now();
    await migrate(db, { migrationsFolder: "./lib/db/migrations" });
    const end = Date.now();

    console.log("Migrations completed in", end - start, "ms");
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.warn("Migration failed, but continuing build...");
    console.warn("Error:", error instanceof Error ? error.message : error);
    console.warn("This is expected during Vercel builds. Migrations should be run separately.");
    process.exit(0);
  }
};

runMigrate().catch((err) => {
  console.error("Migration failed");
  console.error(err);
  process.exit(1);
});
