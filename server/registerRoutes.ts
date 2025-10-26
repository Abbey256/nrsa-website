// server/registerRoutes.ts
import { Express } from "express";

export function registerRoutes(app: Express) {
  app.get("/api/test", (_req, res) => {
    res.json({ message: "Routes working" });
  });

  return require("http").createServer(app);
}