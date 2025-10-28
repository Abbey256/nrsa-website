import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { storage } from "./storage";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

interface JwtPayload {
  adminId: number;
  role?: string;
}

export interface AdminRequest extends Request {
  adminId?: number;
  adminRole?: string;
}

export const requireAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Attach data from token
    req.adminId = decoded.adminId;
    req.adminRole = decoded.role;

    // Validate admin still exists in DB
    const admin = await storage.getAdminById(decoded.adminId);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized - Admin not found" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Unauthorized - Invalid or expired token" });
  }
};

export const requireSuperAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAdmin(req, res, async () => {
    if (req.adminRole !== "super-admin") {
      return res
        .status(403)
        .json({ error: "Forbidden - Super admin access required" });
    }
    next();
  });
};