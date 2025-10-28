import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

import { registerAllRoutes } from "./routes"; // ✅ Corrected import name
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";
import { storage } from "./storage";

dotenv.config();

const app = express();
app.use(express.json());

// ---------- SECURITY ----------
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---------- LOGGING MIDDLEWARE ----------
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------- ROUTES ----------
registerAuthRoutes(app);
registerUploadRoutes(app);
registerAllRoutes(app);

// ---------- STATIC FRONTEND ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../dist/public");

app.use(express.static(distPath));

// ✅ Serve frontend routes properly (for Netlify/Render)
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ---------- ERROR HANDLER ----------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export { server };
