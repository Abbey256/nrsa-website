import { Express } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "./storage.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

/**
 * Authentication Routes
 * 
 * Handles admin login using JWT tokens.
 * Note: Admin account is automatically created on server startup (see server/index.ts)
 * 
 * Security:
 * - JWT tokens expire after 8 hours
 * - Passwords are hashed with bcrypt (10 rounds)
 * - Invalid login attempts return generic error message to prevent username enumeration
 */
export function registerAuthRoutes(app: Express) {
  /**
   * Admin Login Endpoint
   * POST /api/admin/login
   * 
   * Request body: { email: string, password: string }
   * Response: { token: string, admin: { id, name, email } }
   * 
   * Returns 401 for invalid credentials (generic error to prevent enumeration)
   */
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await storage.getAdminByEmail(email);
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    // Verify password hash
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT token valid for 8 hours
    const token = jwt.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: "8h" });
    
    // Return token and admin info (excluding password hash)
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  });
}