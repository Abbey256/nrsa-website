import express, { type Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { registerRoutes } from "./registerRoutes";
import { registerAuthRoutes } from "./auth";
import { setupVite, serveStatic, log } from "./vite";

dotenv.config();

const app = express();

// Express middleware
app.use(express.json({
  verify: (req, _res, buf) => {
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// Register API routes
registerAuthRoutes(app);
registerRoutes(app);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Frontend serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  if (app.get("env") === "development") {
    const httpServer = require("http").createServer(app);
    await setupVite(app, httpServer);
    httpServer.listen(process.env.PORT || 5000, () => log(`Dev server running on port ${process.env.PORT || 5000}`));
  } else {
    const distPath = path.join(__dirname, "../dist");
    serveStatic(app);
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    app.listen(process.env.PORT || 5000, () => log(`Server running on port ${process.env.PORT || 5000}`));
  }
})();
