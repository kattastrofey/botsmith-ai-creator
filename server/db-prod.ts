import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/pg-schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for production');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

console.log('✅ PostgreSQL database connected successfully');

