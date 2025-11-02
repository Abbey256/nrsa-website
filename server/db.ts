import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pkg;

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !supabasePassword) {
  throw new Error("SUPABASE_URL and SUPABASE_DB_PASSWORD must be set");
}

const hostname = new URL(supabaseUrl).hostname;
const projectRef = hostname.split('.')[0];

const databaseUrl = `postgresql://postgres.${projectRef}:${encodeURIComponent(supabasePassword)}@${hostname.replace('.supabase.co', '.supabase.com')}:5432/postgres`;

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });