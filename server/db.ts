import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables correctly
dotenv.config({ path: path.resolve(__dirname, "../.env.production") });

console.log("DATABASE_URL:", process.env.DATABASE_URL);

dotenv.config({ path: path.resolve(__dirname, "../.env.production") });
// --- REWRITE YOUR ENTIRE DB CONNECTION FILE ---

// 1. Import the correct Drizzle driver
import { drizzle } from "drizzle-orm/node-postgres";

// 2. Use the original pg package (for the connection pool)
import pkg from "pg";
import * as schema from "@shared/schema"; 

// Destructure Pool correctly for ES Modules
const { Pool } = pkg;

// Remove all neonConfig and ws imports/setup lines

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be set");

// 3. Create the standard PostgreSQL Pool using the DATABASE_URL
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 4. Initialize Drizzle with the Pool
export const db = drizzle(pool, { schema });

// --- END REWRITE ---