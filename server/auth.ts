import { Express } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "./storage";

export function registerAuthRoutes(app: Express) {
  // First admin setup
  app.post("/api/admin/setup", async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await storage.getAdminByEmail(email);
    if (existing) return res.status(400).json({ error: "Admin already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await storage.createAdmin({ name, email, passwordHash });
    res.json({ id: admin.id, name: admin.name, email: admin.email });
  });

  // Login
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await storage.getAdminByEmail(email);
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, { expiresIn: "8h" });
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  });
}