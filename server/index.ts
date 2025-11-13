import dotenv from 'dotenv';

// Load environment variables first
dotenv.config({ path: '.env.local' });
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { registerAllRoutes as registerRoutes } from "./routes";
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";
import { setupVite, serveStatic, log } from "./vite";
import { createTables } from "./db";

// Create Express app
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});
app.set("trust proxy", 1);

// Rate limiter - more generous in development
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 300 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
}));

// Logging middleware
// ... (Logging middleware code is fine)
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

// ... (All imports, app setup, rate limiter, and logging middleware are fine)

// ✅ STEP 1: REGISTER ALL API ROUTES (CORRECT)
registerAuthRoutes(app);
registerUploadRoutes(app);
registerRoutes(app);

// Error handling (CORRECTLY PLACED AFTER API ROUTES)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});

// ... (After Error Handling middleware)

// ✅ CRITICAL FIX: Add the serveStatic middleware NOW, before the server is created/listened to.
if (process.env.NODE_ENV === "production") {
    serveStatic(app); // THIS MUST BE HERE
}

// Create HTTP server (This line remains)
const server: Server = createServer(app);

// Start server
const PORT = process.env.NODE_ENV === "production"
    ? parseInt(process.env.PORT || "10000")
    : 5000;

(async () => {
    try {
        // Create database tables
        await createTables();
        
        if (process.env.NODE_ENV === "development") {
            await setupVite(app, server);
        } 
        // The ELSE block is now EMPTY because serveStatic was moved above.

        server.listen(PORT, "0.0.0.0", () => {
            log(`Server running on port ${PORT}`);
        });
    } catch (error: any) {
        console.error('Server startup error:', error.message);
        process.exit(1);
    }
})();