import { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAdmin } from "./authMiddleware"; // You should implement this middleware
import {
  insertHeroSlideSchema,
  insertNewsSchema,
  insertEventSchema,
  insertPlayerSchema,
  insertClubSchema,
  insertLeaderSchema,
  insertMediaSchema,
  insertAffiliationSchema,
  insertContactSchema,
  insertSiteSettingSchema
} from "@shared/schema";

/**
 * Registers all CRUD API routes for the application.
 * Includes endpoints for: Hero Slides, News, Events, Players, Clubs, Leaders, 
 * Media, Affiliations, Contacts, and Site Settings.
 * Protected routes require admin authentication via JWT.
 */
export function registerAllRoutes(app: Express): Server {

  // ---------- HERO SLIDES ----------
  app.get("/api/hero-slides", async (req, res) => {
    try { res.json(await storage.getAllHeroSlides()); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.get("/api/hero-slides/:id", async (req, res) => {
    try {
      const slide = await storage.getHeroSlide(parseInt(req.params.id));
      if (!slide) return res.status(404).json({ error: "Slide not found" });
      res.json(slide);
    } catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.post("/api/hero-slides", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.createHeroSlide(insertHeroSlideSchema.parse(req.body));
      res.status(201).json(slide);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.patch("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.updateHeroSlide(parseInt(req.params.id), req.body);
      if (!slide) return res.status(404).json({ error: "Slide not found" });
      res.json(slide);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.delete("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteHeroSlide(parseInt(req.params.id)); res.status(204).send(); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- NEWS ----------
  app.get("/api/news", async (req, res) => {
    try { res.json(await storage.getAllNews()); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.get("/api/news/:id", async (req, res) => {
    try {
      const article = await storage.getNews(parseInt(req.params.id));
      if (!article) return res.status(404).json({ error: "News not found" });
      res.json(article);
    } catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const article = await storage.createNews(insertNewsSchema.parse(req.body));
      res.status(201).json(article);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.patch("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const article = await storage.updateNews(parseInt(req.params.id), req.body);
      if (!article) return res.status(404).json({ error: "News not found" });
      res.json(article);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteNews(parseInt(req.params.id)); res.status(204).send(); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- EVENTS ----------
  app.get("/api/events", async (req, res) => {
    try { res.json(await storage.getAllEvents()); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const event = await storage.createEvent(insertEventSchema.parse(req.body));
      res.status(201).json(event);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(parseInt(req.params.id), req.body);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteEvent(parseInt(req.params.id)); res.status(204).send(); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- PLAYERS ----------
  app.get("/api/players", async (req, res) => {
    try { res.json(await storage.getAllPlayers()); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(parseInt(req.params.id));
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.post("/api/players", requireAdmin, async (req, res) => {
    try {
      const player = await storage.createPlayer(insertPlayerSchema.parse(req.body));
      res.status(201).json(player);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.patch("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const player = await storage.updatePlayer(parseInt(req.params.id), req.body);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.delete("/api/players/:id", requireAdmin, async (req, res) => {
    try { await storage.deletePlayer(parseInt(req.params.id)); res.status(204).send(); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- CLUBS ----------
  app.get("/api/clubs", async (req, res) => {
    try { res.json(await storage.getAllClubs()); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await storage.getClub(parseInt(req.params.id));
      if (!club) return res.status(404).json({ error: "Club not found" });
      res.json(club);
    } catch (e:any) { res.status(500).json({ error: e.message }); }
  });
  app.post("/api/clubs", requireAdmin, async (req, res) => {
    try {
      const club = await storage.createClub(insertClubSchema.parse(req.body));
      res.status(201).json(club);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.patch("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      const club = await storage.updateClub(parseInt(req.params.id), req.body);
      if (!club) return res.status(404).json({ error: "Club not found" });
      res.json(club);
    } catch (e:any) { res.status(400).json({ error: e.message }); }
  });
  app.delete("/api/clubs/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteClub(parseInt(req.params.id)); res.status(204).send(); }
    catch (e:any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- LEADERS ----------
  app.get("/api/leaders", async (req, res) => { try { res.json(await storage.getAllLeaders()); } catch(e:any){ res.status(500).json({ error:e.message }); } });
  app.get("/api/leaders/:id", async (req,res)=>{ try{ const leader = await storage.getLeader(parseInt(req.params.id)); if(!leader) return res.status(404).json({error:"Leader not found"}); res.json(leader); } catch(e:any){ res.status(500).json({error:e.message}); } });
  app.post("/api/leaders", requireAdmin, async (req,res)=>{ try{ const leader = await storage.createLeader(insertLeaderSchema.parse(req.body)); res.status(201).json(leader); } catch(e:any){ res.status(400).json({error:e.message}); } });
  app.patch("/api/leaders/:id", requireAdmin, async (req,res)=>{ try{ const leader = await storage.updateLeader(parseInt(req.params.id), req.body); if(!leader) return res.status(404).json({error:"Leader not found"}); res.json(leader); } catch(e:any){ res.status(400).json({error:e.message}); } });
  app.delete("/api/leaders/:id", requireAdmin, async (req,res)=>{ try{ await storage.deleteLeader(parseInt(req.params.id)); res.status(204).send(); } catch(e:any){ res.status(500).json({error:e.message}); } });

  // ---------- MEDIA ----------
  app.get("/api/media", async (req,res)=>{ try{ res.json(await storage.getAllMedia()); } catch(e:any){ res.status(500).json({error:e.message}); } });
  app.get("/api/media/:id", async (req,res)=>{ try{ const item = await storage.getMediaItem(parseInt(req.params.id)); if(!item) return res.status(404).json({error:"Media not found"}); res.json(item); } catch(e:any){ res.status(500).json({error:e.message}); } });
  app.post("/api/media", requireAdmin, async (req,res)=>{ try{ const item = await storage.createMedia(insertMediaSchema.parse(req.body)); res.status(201).json(item); } catch(e:any){ res.status(400).json({error:e.message}); } });
  app.patch("/api/media/:id", requireAdmin, async (req,res)=>{ try{ const item = await storage.updateMedia(parseInt(req.params.id), req.body); if(!item) return res.status(404).json({error:"Media not found"}); res.json(item); } catch(e:any){ res.status(400).json({error:e.message}); } });
  app.delete("/api/media/:id", requireAdmin, async (req,res)=>{ try{ await storage.deleteMedia(parseInt(req.params.id)); res.status(204).send(); } catch(e:any){ res.status(500).json({error:e.message}); } });

  // ---------- AFFILIATIONS ----------
  app.get("/api/affiliations", async (req,res)=>{ try{ res.json(await storage.getAllAffiliations()); } catch(e:any){ res.status(500).json({error:e.message}); } });
  app.post("/api/affiliations", requireAdmin, async (req,res)=>{ try{ const aff = await storage.createAffiliation(insertAffiliationSchema.parse(req.body)); res.status(201).json(aff); } catch(e:any){ res.status(400).json({error:e.message}); } });

  // ---------- CONTACTS ----------
  app.get("/api/contacts", async (req,res)=>{ try{ res.json(await storage.getAllContacts()); } catch(e:any){ res.status(500).json({error:e.message}); } });
  app.post("/api/contacts", async (req,res)=>{ try{ const contact = await storage.createContact(insertContactSchema.parse(req.body)); res.status(201).json(contact); } catch(e:any){ res.status(400).json({error:e.message}); } });

  // ---------- SITE SETTINGS ----------
  app.get("/api/site-settings", async (req,res)=>{ try{ res.json(await storage.getAllSiteSettings()); } catch(e:any){ res.status(500).json({error:e.message}); } });
  app.post("/api/site-settings", requireAdmin, async (req,res)=>{ try{ const setting = await storage.createSiteSetting(insertSiteSettingSchema.parse(req.body)); res.status(201).json(setting); } catch(e:any){ res.status(400).json({error:e.message}); } });

  return createServer(app);
}