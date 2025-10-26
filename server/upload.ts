import { Express, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { requireAdmin } from "./authMiddleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * File Upload Configuration
 * 
 * This module handles secure file uploads for admin users.
 * Images are stored in the client/public/uploads directory and served statically.
 * 
 * Security Features:
 * - Admin authentication required (JWT token)
 * - File type validation (only images allowed)
 * - File size limit (5MB)
 * - Sanitized filenames with timestamps
 * 
 * Usage:
 * POST /api/upload
 * Headers: Authorization: Bearer <token>
 * Body: multipart/form-data with 'image' field
 * Response: { url: "/uploads/filename.jpg" }
 */

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Store files in client/public/uploads so they're served statically
    const uploadDir = path.join(__dirname, "../client/public/uploads");
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // Sanitize filename: remove special characters
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "");
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  }
});

// File filter: only accept images
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."));
  }
};

// Initialize multer with configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * Register file upload routes
 * 
 * @param app - Express application instance
 */
export function registerUploadRoutes(app: Express) {
  /**
   * Image Upload Endpoint
   * POST /api/upload
   * 
   * Accepts a single image file and stores it securely.
   * Requires admin authentication.
   * 
   * Request:
   * - Headers: Authorization: Bearer <JWT token>
   * - Body: multipart/form-data with 'image' field
   * 
   * Response:
   * - Success: { url: "/uploads/filename.jpg" }
   * - Error: { error: "Error message" }
   */
  app.post("/api/upload", requireAdmin, upload.single("image"), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Return the public URL path for the uploaded file
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({ 
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Upload failed" });
    }
  });
}
