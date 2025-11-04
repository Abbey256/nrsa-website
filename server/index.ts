import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import rateLimit from "express-rate-limit";
import { registerAllRoutes as registerRoutes } from "./routes";
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";
import { setupVite, serveStatic, log } from "./vite";

// Create Express app
const app = express();
app.use(express.json());
app.set("trust proxy", 1);

// Rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  let jsonResponse: any = null;

  // Keep original json method
  const originalJson = res.json.bind(res);

  // Override json
  res.json = function (body: any) {
    jsonResponse = body;
    return originalJson(body); // Only pass the body
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (jsonResponse) logLine += ` :: ${JSON.stringify(jsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      console.log(logLine);
    }
  });

  next();
});

// Register routes AFTER app creation
registerAuthRoutes(app);
registerUploadRoutes(app);
registerRoutes(app);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Create HTTP server
const server: Server = createServer(app);

// Start server
const PORT = process.env.NODE_ENV === "production"
  ? parseInt(process.env.PORT || "10000")
  : 5000;

(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();

export { server };