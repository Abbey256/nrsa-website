import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";

import { registerRoutes } from "./registerRoutes";
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/admin/login", authLimiter);
app.use("/api/", apiLimiter);

app.use(express.json({ verify: (req, _res, buf) => (req as any).rawBody = buf }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (req.path.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store");
  } else {
    res.setHeader("Cache-Control", "no-cache");
  }
  next();
});

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

registerAuthRoutes(app);
registerUploadRoutes(app);
registerRoutes(app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDefaultAdminExists() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nrsa.com.ng";
    const adminPassword = process.env.ADMIN_PASSWORD || "adminnrsa.passme5@00121";
    const adminName = process.env.ADMIN_NAME || "Super Administrator";
    
    const legacyEmail = "admin1@nrsa.com.ng";
    const legacyAdmin = await storage.getAdminByEmail(legacyEmail);
    
    if (legacyAdmin && legacyEmail !== adminEmail) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await storage.updateAdmin(legacyAdmin.id, {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "super-admin",
        protected: true
      });
      log("✓ Legacy admin updated to new credentials and marked as protected");
    }
    
    const existingAdmin = await storage.getAdminByEmail(adminEmail);

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await storage.createAdmin({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "super-admin",
        protected: true
      } as any);
      log("✓ Default super-admin user created successfully (protected)");
      if (!process.env.ADMIN_EMAIL) log("⚠ Using default admin credentials - change in env vars for production");
    } else if (!existingAdmin.protected) {
      await storage.updateAdmin(existingAdmin.id, {
        protected: true
      });
      log("✓ Existing super-admin marked as protected");
    } else {
      log("✓ Default super-admin user already exists and is protected");
    }
  } catch (error) {
    log(`Warning: Could not create default admin user - ${error}`);
  }
}

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
    
    app.listen(process.env.PORT || 5000, () => log(`Server running on port ${process.env.PORT || 5000}`));
  }
})();
