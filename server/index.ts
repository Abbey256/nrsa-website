import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

import { registerRoutes } from "./registerRoutes";
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ verify: (req, _res, buf) => (req as any).rawBody = buf }));
app.use(express.urlencoded({ extended: false }));

// Logging
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

// Register routes
registerAuthRoutes(app);
registerUploadRoutes(app);
registerRoutes(app);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure default admin exists
async function ensureDefaultAdminExists() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin1@nrsa.com.ng";
    const adminPassword = process.env.ADMIN_PASSWORD || "adminpassme2$";
    
    const existingAdmin = await storage.getAdminByEmail(adminEmail);

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await storage.createAdmin({
        name: process.env.ADMIN_NAME || "Main Admin",
        email: adminEmail,
        passwordHash
      });
      log("✓ Default admin user created successfully");
      if (!process.env.ADMIN_EMAIL) log("⚠ Using default admin credentials - change in env vars for production");
    } else {
      log("✓ Default admin user already exists");
    }
  } catch (error) {
    log(`Warning: Could not create default admin user - ${error}`);
  }
}

// Start server
(async () => {
  await ensureDefaultAdminExists();

  if (app.get("env") === "development") {
    const httpServer = createServer(app);
    await setupVite(app, httpServer);
    httpServer.listen(process.env.PORT || 5000, () => log(`Dev server running on port ${process.env.PORT || 5000}`));
  } else {
    const distPath = path.join(__dirname, "../dist");
    serveStatic(app);
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
    
    // This is the single, correct app.listen call for production
    app.listen(process.env.PORT || 5000, () => log(`Server running on port ${process.env.PORT || 5000}`));
  }
})();