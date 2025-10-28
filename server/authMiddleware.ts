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

export const requireAdmin = async (req: AdminRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.adminId = decoded.adminId;
    
    const admin = await storage.getAdminById(decoded.adminId);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized - Admin not found" });
    }
    
    req.adminRole = admin.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

export const requireSuperAdmin = async (req: AdminRequest, res: Response, next: NextFunction) => {
  await requireAdmin(req, res, () => {
    if (req.adminRole !== "super-admin") {
      return res.status(403).json({ error: "Forbidden - Super admin access required" });
    }
    next();
  });
};
