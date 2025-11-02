import express, { Express, Request, Response } from "express";
import multer from "multer";
import { supabase } from "./lib/supabase";
import { requireAdmin } from "./authMiddleware";

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

router.post("/upload", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filepath = `uploads/${filename}`;

    const { data, error } = await supabase.storage
      .from("nrsa-uploads")
      .upload(filepath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return res.status(500).json({ error: error.message });
    }

    const { data: { publicUrl } } = supabase.storage
      .from("nrsa-uploads")
      .getPublicUrl(data.path);

    res.status(200).json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export function registerUploadRoutes(app: Express) {
  app.use("/api", router);
}
