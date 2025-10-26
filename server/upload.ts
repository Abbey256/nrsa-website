import { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { requireAdmin } from "./authMiddleware";

/**
 * File Upload Configuration using Cloudinary Permanent Storage
 * * Images are uploaded directly to Cloudinary using the CLOUDINARY_URL 
 * environment variable for credentials. This resolves the 500 error 
 * caused by trying to save files locally on the ephemeral Render disk.
 * The response now returns the public Cloudinary URL.
 */

// 1. Configure Cloudinary Storage
// The Cloudinary SDK automatically reads the CLOUDINARY_URL environment variable.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "nrsa-website-uploads", // All files will be stored in this folder on Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp', 'gif'] as any, // Cloudinary type safety
        // This function creates a safe, unique public ID for the file in Cloudinary
        public_id: (_req, file) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            const nameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
            const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "");
            return `${safeName}-${uniqueSuffix}`;
        },
    } as any,
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

// Initialize multer with Cloudinary storage
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

/**
 * Register file upload routes
 * * @param app - Express application instance
 */
export function registerUploadRoutes(app: Express) {
    const uploadMiddleware = upload.single("image");

    /**
     * Helper middleware to handle Multer errors (like file size limits or file type)
     * and return a proper 400 Bad Request instead of a generic 500.
     */
    const handleMulterErrors = (req: Request, res: Response, next: NextFunction) => {
        uploadMiddleware(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // e.g., 'File too large' or other internal Multer limits
                return res.status(400).json({ error: err.message });
            } else if (err) {
                // Custom error from fileFilter (e.g., 'Invalid file type')
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    };
    
    /**
     * Image Upload Endpoint
     * POST /api/upload
     * * The file is uploaded to Cloudinary and the public URL is returned.
     */
    app.post("/api/upload", requireAdmin, handleMulterErrors, (req: Request, res: Response) => {
        try {
            // Cloudinary's storage engine extends req.file with its own properties (path/secure_url)
            const uploadedFile = req.file as Express.Multer.File & { path: string, secure_url: string, filename: string };
            
            if (!uploadedFile) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // req.file.secure_url contains the publicly accessible Cloudinary URL
            const fileUrl = uploadedFile.secure_url || uploadedFile.path;
            
            res.json({ 
                url: fileUrl, // <--- This is the permanent, public URL
                filename: uploadedFile.filename, // Cloudinary public_id
                size: uploadedFile.size,
                mimetype: uploadedFile.mimetype
            });
        } catch (error: any) {
            // Fallback for unexpected errors inside the final route handler
            console.error("Cloudinary upload final handler error:", error);
            res.status(500).json({ error: error.message || "Upload failed" });
        }
    });
}