import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.production
dotenv.config({ path: path.resolve(__dirname, "../.env.production") });

// Debug: confirm DATABASE_URL is loaded
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// --- DB Connection Setup ---

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });