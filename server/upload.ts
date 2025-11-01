import express, { Express, Request, Response } from "express";
import multer from "multer";
import { supabase } from "./lib/supabase"; // backend-safe client
import { requireAdmin } from "./authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const { data, error } = await supabase.storage
    .from("your-bucket-name") // replace with your actual bucket name
    .upload(`uploads/${Date.now()}-${file.originalname}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) return res.status(500).json({ error: error.message });

  const publicUrl = supabase.storage
    .from("your-bucket-name")
    .getPublicUrl(data.path).data.publicUrl;

  res.status(200).json({ url: publicUrl });
});

// ✅ Register the router with your Express app
export function registerUploadRoutes(app: Express) {
  app.use("/api", router); // or "/api/upload" if you want to namespace it
}