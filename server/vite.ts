import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const clientRoot = path.resolve(import.meta.dirname, "..", "client");
  
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    root: clientRoot,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "..", "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "..", "shared"),
        "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
      },
    },
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }

    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// Corrected serveStatic function in vite.ts
export function serveStatic(app: Express) {
    // ✅ FIX 2: Resolving the path: 
    // /home/gdmythjq/backend -> /home/gdmythjq -> /home/gdmythjq/public_html
    const finalDistPath = path.resolve(process.cwd(), "..", "public_html");
    
    // ... (rest of the file existence check and app.use code)
    if (!fs.existsSync(finalDistPath)) {
        throw new Error(
            `Could not find the public_html directory at: ${finalDistPath}.`,
        );
    }

    // 1. Serve static assets
    app.use(express.static(finalDistPath));

    // 2. SPA fallback
    app.use("*", (req, res, next) => {
        if (req.originalUrl.startsWith("/api/")) {
            return next();
        }
        res.sendFile(path.resolve(finalDistPath, "index.html"));
    });
}
