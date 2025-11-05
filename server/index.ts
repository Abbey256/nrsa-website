import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import rateLimit from "express-rate-limit";
import { registerAllRoutes as registerRoutes } from "./routes.js";
import { registerAuthRoutes } from "./auth.js";
import { registerUploadRoutes } from "./upload.js";
import { setupVite, serveStatic, log } from "./vite.js"; // Assuming these are correctly imported

// Create Express app
const app = express();
app.use(express.json());
app.set("trust proxy", 1);

// Rate limiter
// ... (Rate limiter code is fine)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
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
    if (process.env.NODE_ENV === "development") {
        await setupVite(app, server);
    } 
    // The ELSE block is now EMPTY because serveStatic was moved above.

    server.listen(PORT, "0.0.0.0", () => {
        log(`Server running on port ${PORT}`);
    });
})();