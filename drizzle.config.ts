import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const databaseUrl = process.env.DATABASE_URL;
const isSQLite = databaseUrl.startsWith('file:');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isSQLite ? "sqlite" : "postgresql",
  dbCredentials: isSQLite 
    ? { url: databaseUrl.replace('file:', '') }
    : { url: databaseUrl },
});
