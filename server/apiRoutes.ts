// server/apiRoutes.ts
import { Express, Request, Response } from "express";
import { createServer, Server } from "http";
import { storage } from "./storage.js";
import { requireAdmin, requireSuperAdmin } from "./authMiddleware.js";
import {
  insertHeroSlideSchema,
  insertNewsSchema,
  insertEventSchema,
  insertPlayerSchema,
  insertClubSchema,
  insertLeaderSchema,
  insertMediaSchema,
  insertContactSchema,
  insertMemberStateSchema,
  insertSiteSettingSchema,
} from "@shared/schema";

/**
 * Extract YouTube video ID from a URL
 */
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Register all API routes
 */
export function registerAllRoutes(app: Express): Server {
  // ---------- HERO SLIDES ----------
  app.get("/api/hero-slides", async (_req, res) => {
    try {
      res.json(await storage.getAllHeroSlides());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/hero-slides", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.createHeroSlide(insertHeroSlideSchema.parse(req.body));
      res.status(201).json(slide);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.updateHeroSlide(parseInt(req.params.id), req.body);
      if (!slide) return res.status(404).json({ error: "Slide not found" });
      res.json(slide);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteHeroSlide(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- NEWS ----------
  app.get("/api/news", async (_req, res) => {
    try {
      res.json(await storage.getAllNews());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const article = await storage.getNews(parseInt(req.params.id));
      if (!article) return res.status(404).json({ error: "News not found" });
      res.json(article);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const article = await storage.createNews(insertNewsSchema.parse(req.body));
      res.status(201).json(article);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const article = await storage.updateNews(parseInt(req.params.id), req.body);
      if (!article) return res.status(404).json({ error: "News not found" });
      res.json(article);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteNews(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- EVENTS ----------
  app.get("/api/events", async (_req, res) => {
    try {
      res.json(await storage.getAllEvents());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const event = await storage.createEvent(insertEventSchema.parse(req.body));
      res.status(201).json(event);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(parseInt(req.params.id), req.body);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- PLAYERS ----------
  app.get("/api/players", async (_req, res) => {
    try {
      res.json(await storage.getAllPlayers());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/players", requireAdmin, async (req, res) => {
    try {
      const player = await storage.createPlayer(insertPlayerSchema.parse(req.body));
      res.status(201).json(player);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const player = await storage.updatePlayer(parseInt(req.params.id), req.body);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePlayer(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- CLUBS ----------
  app.get("/api/clubs", async (_req, res) => {
    try {
      res.json(await storage.getAllClubs());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/clubs", requireAdmin, async (req, res) => {
    try {
      const club = await storage.createClub(insertClubSchema.parse(req.body));
      res.status(201).json(club);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      const club = await storage.updateClub(parseInt(req.params.id), req.body);
      if (!club) return res.status(404).json({ error: "Club not found" });
      res.json(club);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteClub(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- LEADERS ----------
  app.get("/api/leaders", async (_req, res) => {
    try {
      res.json(await storage.getAllLeaders());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/leaders", requireAdmin, async (req, res) => {
    try {
      const leader = await storage.createLeader(insertLeaderSchema.parse(req.body));
      res.status(201).json(leader);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch("/api/leaders/:id", requireAdmin, async (req, res) => {
    try {
      const leader = await storage.updateLeader(parseInt(req.params.id), req.body);
      if (!leader) return res.status(404).json({ error: "Leader not found" });
      res.json(leader);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/leaders/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteLeader(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- MEDIA ----------
  app.get("/api/media", async (_req, res) => {
    try {
      res.json(await storage.getAllMedia());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const media = await storage.createMedia(insertMediaSchema.parse(req.body));
      res.status(201).json(media);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMedia(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------- CONTACTS ----------
  app.get("/api/contacts", async (_req, res) => {
    try {
      res.json(await storage.getAllContacts());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = await storage.createContact(insertContactSchema.parse(req.body));
      res.status(201).json(contact);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ---------- MEMBER STATES ----------
  app.get("/api/member-states", async (_req, res) => {
    try {
      res.json(await storage.getAllMemberStates());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/member-states", requireAdmin, async (req, res) => {
    try {
      const state = await storage.createMemberState(insertMemberStateSchema.parse(req.body));
      res.status(201).json(state);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ---------- SITE SETTINGS ----------
  app.get("/api/site-settings", async (_req, res) => {
    try {
      res.json(await storage.getAllSiteSettings());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/site-settings", requireSuperAdmin, async (req, res) => {
    try {
      const setting = await storage.createSiteSetting(insertSiteSettingSchema.parse(req.body));
      res.status(201).json(setting);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // ---------- TEST ROUTE ----------
  app.get("/api/test", (_req, res) => {
    res.json({ message: "Routes working" });
  });

  return createServer(app);
}