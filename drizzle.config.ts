import { defineConfig } from "drizzle-kit";

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("SUPABASE_URL must be set");
}

const hostname = new URL(supabaseUrl).hostname;
const projectRef = hostname.split('.')[0];
const databaseUrl = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_SERVICE_ROLE_KEY}@${hostname}:5432/postgres`;

export default defineConfig({
    schema: "./shared/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: databaseUrl,
    },
});