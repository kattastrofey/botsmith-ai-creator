import { drizzle } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import path from "path";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not found. Using SQLite for development.");
  process.env.DATABASE_URL = "file:./dev.db";
}

const databaseUrl = process.env.DATABASE_URL;
let db: ReturnType<typeof drizzle> | ReturnType<typeof drizzleNeon>;

// Check if using SQLite (file://) or PostgreSQL (postgresql://)
if (databaseUrl.startsWith('file:')) {
  // SQLite setup
  const dbPath = databaseUrl.replace('file:', '');
  const fullPath = path.resolve(dbPath);
  console.log(`📁 Using SQLite database: ${fullPath}`);
  
  try {
    const sqlite = new Database(fullPath);
    db = drizzle(sqlite, { schema });
    console.log('✅ SQLite database connected successfully');
  } catch (error) {
    throw new Error(
      "Failed to initialize SQLite database.\n" +
      "Error: " + (error instanceof Error ? error.message : String(error))
    );
  }
} else if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
  // PostgreSQL setup
  console.log('🐘 Using PostgreSQL database');
  
  try {
    const sql = neon(databaseUrl);
    db = drizzleNeon(sql, { schema });
    console.log('✅ PostgreSQL database connected successfully');
  } catch (error) {
    throw new Error(
      "Failed to initialize PostgreSQL database. Please check your DATABASE_URL.\n" +
      "Error: " + (error instanceof Error ? error.message : String(error))
    );
  }
} else {
  throw new Error(
    "Invalid DATABASE_URL format. Must start with 'file:' (SQLite) or 'postgresql://'/'postgres://' (PostgreSQL)\n" +
    "Current value: " + databaseUrl.substring(0, 50) + "..."
  );
}

export { db };
export const dbType = databaseUrl.startsWith('file:') ? 'sqlite' : 'postgresql';
