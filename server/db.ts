import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "@shared/schema";

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables (for production)
dotenv.config({ path: path.resolve(__dirname, "../.env.production") });

// Debug log (optional)
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const { Pool } = pkg;

// ✅ Ensure DB URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// ✅ Enable SSL for Supabase
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });