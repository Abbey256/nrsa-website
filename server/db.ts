import ws from "ws";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";

// 1. Configure the WebSocket for the serverless driver
// This line is correct and necessary for a server environment.
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be set");

// 2. Create the 'sql' connection function using the Neon driver
// This replaces the old 'new Pool' setup entirely.
const sql = neon(process.env.DATABASE_URL);

// 3. Create the Drizzle DB instance using the 'sql' function
export const db = drizzle(sql, { schema });

// NOTE: You no longer need to export 'pool' or import 'pkg' (pg)
// You should also remove the 'pg' dependency from your package.json