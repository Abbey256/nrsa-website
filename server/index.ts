import dotenv from 'dotenv';

// Load environment variables first
dotenv.config({ path: '.env.local' });
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import rateLimit from "express-rate-limit";
import cors from "cors";
import compression from "compression";
import { registerAllRoutes as registerRoutes } from "./routes";
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";
import { setupVite, serveStatic, log } from "./vite";
import { createTables } from "./db";

// Create Express app
const app = express();
app.use(cors({
  origin: ['https://nrsa.com.ng', 'https://www.nrsa.com.ng', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Enable preflight for all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
  }
  next();
});
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

// API routes first
registerAuthRoutes(app);
registerUploadRoutes(app);
registerRoutes(app);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
    serveStatic(app);
}

// Error handling last
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});

// Create HTTP server (This line remains)
const server: Server = createServer(app);

// Start server - Railway assigns PORT automatically
const PORT = parseInt(process.env.PORT || "3000");

(async () => {
    try {
        await createTables();
        
        if (process.env.NODE_ENV === "development") {
            await setupVite(app, server);
        }

        server.listen(PORT, () => {
            log(`Server running on port ${PORT}`);
        });
    } catch (error: any) {
        console.error('Server startup error:', error.message);
        process.exit(1);
    }
})();

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});