import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import { registerAllRoutes } from "./routes";
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";

// ✅ FIX #1 – Load correct env file even in production
import { config } from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, "../.env.production") });

const app = express();
app.use(express.json());

// ---------- SECURITY ----------
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---------- LOGGING ----------
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------- ROUTES ----------
registerAuthRoutes(app);
registerUploadRoutes(app);
registerAllRoutes(app);

// ---------- STATIC FRONTEND ----------
const distPath = path.join(__dirname, "../dist/public");
app.use(express.static(distPath));

// ✅ FIX #2 – Serve React routes correctly (important for SPA)
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ---------- ERROR HANDLER ----------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------- START SERVER ----------
// ✅ FIX #3 – Use Render’s PORT and allow fallback
const PORT = process.env.PORT || 10000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Database: ${process.env.DATABASE_URL ? "Connected ✅" : "❌ Missing"}`);
});

export { server };