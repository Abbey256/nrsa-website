// drizzle.config.ts

import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// 💡 CHANGE THIS LINE: Specify the path to your production .env file
dotenv.config({ path: ".env.production" }); 

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not found. Ensure your .env file is set up correctly.");
}

export default defineConfig({
    schema: "./shared/schema.ts",
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});