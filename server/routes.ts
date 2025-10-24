import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
  insertSiteSettingSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hero Slides
  app.get("/api/hero-slides", async (req, res) => {
    try {
      const slides = await storage.getAllHeroSlides();
      res.json(slides);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hero-slides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const slide = await storage.getHeroSlide(id);
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }
      res.json(slide);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hero-slides", async (req, res) => {
    try {
      const validated = insertHeroSlideSchema.parse(req.body);
      const slide = await storage.createHeroSlide(validated);
      res.status(201).json(slide);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/hero-slides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const slide = await storage.updateHeroSlide(id, req.body);
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }
      res.json(slide);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/hero-slides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteHeroSlide(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // News
  app.get("/api/news", async (req, res) => {
    try {
      const newsItems = await storage.getAllNews();
      res.json(newsItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getNews(id);
      if (!article) {
        return res.status(404).json({ error: "News not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validated = insertNewsSchema.parse(req.body);
      const article = await storage.createNews(validated);
      res.status(201).json(article);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.updateNews(id, req.body);
      if (!article) {
        return res.status(404).json({ error: "News not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNews(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const eventsList = await storage.getAllEvents();
      res.json(eventsList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validated = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validated);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.updateEvent(id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEvent(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Players
  app.get("/api/players", async (req, res) => {
    try {
      const playersList = await storage.getAllPlayers();
      res.json(playersList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const validated = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validated);
      res.status(201).json(player);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.updatePlayer(id, req.body);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePlayer(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clubs
  app.get("/api/clubs", async (req, res) => {
    try {
      const clubsList = await storage.getAllClubs();
      res.json(clubsList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const club = await storage.getClub(id);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/clubs", async (req, res) => {
    try {
      const validated = insertClubSchema.parse(req.body);
      const club = await storage.createClub(validated);
      res.status(201).json(club);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/clubs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const club = await storage.updateClub(id, req.body);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/clubs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClub(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Leaders
  app.get("/api/leaders", async (req, res) => {
    try {
      const leadersList = await storage.getAllLeaders();
      res.json(leadersList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leaders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leader = await storage.getLeader(id);
      if (!leader) {
        return res.status(404).json({ error: "Leader not found" });
      }
      res.json(leader);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/leaders", async (req, res) => {
    try {
      const validated = insertLeaderSchema.parse(req.body);
      const leader = await storage.createLeader(validated);
      res.status(201).json(leader);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/leaders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leader = await storage.updateLeader(id, req.body);
      if (!leader) {
        return res.status(404).json({ error: "Leader not found" });
      }
      res.json(leader);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/leaders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLeader(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Media
  app.get("/api/media", async (req, res) => {
    try {
      const mediaList = await storage.getAllMedia();
      res.json(mediaList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMediaItem(id);
      if (!item) {
        return res.status(404).json({ error: "Media not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const validated = insertMediaSchema.parse(req.body);
      const item = await storage.createMedia(validated);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.updateMedia(id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Media not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMedia(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Affiliations
  app.get("/api/affiliations", async (req, res) => {
    try {
      const affiliationsList = await storage.getAllAffiliations();
      res.json(affiliationsList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/affiliations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const affiliation = await storage.getAffiliation(id);
      if (!affiliation) {
        return res.status(404).json({ error: "Affiliation not found" });
      }
      res.json(affiliation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/affiliations", async (req, res) => {
    try {
      const validated = insertAffiliationSchema.parse(req.body);
      const affiliation = await storage.createAffiliation(validated);
      res.status(201).json(affiliation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/affiliations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const affiliation = await storage.updateAffiliation(id, req.body);
      if (!affiliation) {
        return res.status(404).json({ error: "Affiliation not found" });
      }
      res.json(affiliation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/affiliations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAffiliation(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contacts
  app.get("/api/contacts", async (req, res) => {
    try {
      const contactsList = await storage.getAllContacts();
      res.json(contactsList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.getContact(id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validated = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validated);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/contacts/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.markContactAsRead(id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContact(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Site Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validated = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.setSetting(validated);
      res.json(setting);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
