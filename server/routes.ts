import { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAdmin, requireSuperAdmin, type AdminRequest } from "./authMiddleware";
import bcrypt from "bcrypt";
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
 * Registers all CRUD API routes for the application.
 * Includes endpoints for all entities. Admin protection added where necessary.
 */
export function registerAllRoutes(app: Express): Server {

  // ---------- HERO SLIDES ----------
  app.get("/api/hero-slides", async (req, res) => {
    try { res.json(await storage.getAllHeroSlides()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/hero-slides", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.createHeroSlide(insertHeroSlideSchema.parse(req.body));
      res.status(201).json(slide);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.updateHeroSlide(parseInt(req.params.id), req.body);
      if (!slide) return res.status(404).json({ error: "Slide not found" });
      res.json(slide);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteHeroSlide(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- NEWS ----------
  app.get("/api/news", async (req, res) => {
    try { res.json(await storage.getAllNews()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/news/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const article = await storage.getNews(id);

    if (!article) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json(article);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const article = await storage.createNews(insertNewsSchema.parse(req.body));
      res.status(201).json(article);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const article = await storage.updateNews(parseInt(req.params.id), req.body);
      if (!article) return res.status(404).json({ error: "News not found" });
      res.json(article);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteNews(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- EVENTS ----------
  app.get("/api/events", async (req, res) => {
    try { res.json(await storage.getAllEvents()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const event = await storage.createEvent(insertEventSchema.parse(req.body));
      res.status(201).json(event);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const validatedBody = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(parseInt(req.params.id), validatedBody);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- PLAYERS ----------
  app.get("/api/players", async (req, res) => {
    try { res.json(await storage.getAllPlayers()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/players", requireAdmin, async (req, res) => {
    try {
      const player = await storage.createPlayer(insertPlayerSchema.parse(req.body));
      res.status(201).json(player);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const player = await storage.updatePlayer(parseInt(req.params.id), req.body);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePlayer(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ---------- CLUBS ----------
  app.get("/api/clubs", async (req, res) => {
    try { res.json(await storage.getAllClubs()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/clubs", requireAdmin, async (req, res) => {
    try {
      const club = await storage.createClub(insertClubSchema.parse(req.body));
      res.status(201).json(club);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.patch("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      const club = await storage.updateClub(parseInt(req.params.id), req.body);
      if (!club) return res.status(404).json({ error: "Club not found" });
      res.json(club);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteClub(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

// ---------- MEMBER STATES ----------
app.get("/api/member-states", async (req, res) => {
  try {
    res.json(await storage.getAllMemberStates());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/member-states/:id", async (req, res) => {
  try {
    const state = await storage.getMemberState(parseInt(req.params.id));
    if (!state) return res.status(404).json({ error: "Member State not found" });
    res.json(state);
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

app.patch("/api/member-states/:id", requireAdmin, async (req, res) => {
  try {
    const state = await storage.updateMemberState(parseInt(req.params.id), req.body);
    if (!state) return res.status(404).json({ error: "Member State not found" });
    res.json(state);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/member-states/:id", requireAdmin, async (req, res) => {
  try {
    await storage.deleteMemberState(parseInt(req.params.id));
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ---------- LEADERS ----------
app.get("/api/leaders", async (req, res) => {
  try {
    res.json(await storage.getAllLeaders());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Get a single leader by ID
app.get("/api/leaders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const leader = await storage.getLeader(id);
    if (!leader) return res.status(404).json({ error: "Leader not found" });
    res.json(leader);
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
    const id = parseInt(req.params.id);
    const updatedData = insertLeaderSchema.partial().parse(req.body);
    const leader = await storage.updateLeader(id, updatedData);
    if (!leader) return res.status(404).json({ error: "Leader not found" });
    res.json(leader);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/leaders/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteLeader(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
  // ---------- MEDIA ----------
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

  app.get("/api/media", async (req, res) => {
    try { res.json(await storage.getAllMedia()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const item = await storage.getMediaItem(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: "Media not found" });
      res.json(item);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const body = req.body;
      let mediaData: any = {
        title: body.title,
        description: body.description,
        category: body.category,
      };

      if (body.externalUrl) {
        mediaData.imageUrl = body.externalUrl;
        mediaData.isExternal = true;
        const videoId = extractYouTubeVideoId(body.externalUrl);
        if (videoId) {
          mediaData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      } else {
        mediaData.imageUrl = body.imageUrl;
        mediaData.isExternal = false;
        mediaData.thumbnailUrl = null;
      }

      const validatedData = insertMediaSchema.parse(mediaData);
      const item = await storage.createMedia({
        ...validatedData,
        isExternal: mediaData.isExternal,
        thumbnailUrl: mediaData.thumbnailUrl,
      });
      res.status(201).json(item);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

 app.patch("/api/media/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    let updateData: any = {
      title: body.title,
      description: body.description,
      category: body.category,
    };

    if (body.externalUrl) {
      updateData.imageUrl = body.externalUrl;
      updateData.isExternal = true;
      const videoId = extractYouTubeVideoId(body.externalUrl);
      if (videoId) {
        updateData.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else {
        updateData.thumbnailUrl = null;
      }
    } else if (body.imageUrl) {
      updateData.imageUrl = body.imageUrl;
      updateData.isExternal = false;
      updateData.thumbnailUrl = null;
    }

    const validatedData = insertMediaSchema.partial().parse(updateData);
    const updatedItem = await storage.updateMedia(parseInt(id), {
      ...validatedData,
      isExternal: updateData.isExternal,
      thumbnailUrl: updateData.thumbnailUrl,
    });

    if (!updatedItem) return res.status(404).json({ error: "Media not found" });

    res.json(updatedItem);
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
});

  app.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMedia(parseInt(req.params.id));
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  

// ---------- CONTACTS ----------
app.post("/api/contacts", async (req, res) => {
  try {
    const contact = await storage.createContact(insertContactSchema.parse(req.body));
    res.status(201).json(contact);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Admin-only endpoints
app.get("/api/contacts", requireAdmin, async (req, res) => {
  try {
    res.json(await storage.getAllContacts());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/contacts/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const all = await storage.getAllContacts();
    const item = all.find((c) => c.id === id);
    if (!item) return res.status(404).json({ error: "Contact not found" });
    res.json(item);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/api/contacts/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await storage.updateContact(id, req.body);
    if (!updated) return res.status(404).json({ error: "Contact not found" });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/contacts/:id", requireAdmin, async (req, res) => {
  try {
    await storage.deleteContact(parseInt(req.params.id));
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

  // ---------- SITE SETTINGS ----------
  app.get("/api/site-settings", async (req, res) => {
    try { res.json(await storage.getAllSiteSettings()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch("/api/site-settings/:id", requireAdmin, async (req, res) => {
    try {
      const setting = await storage.updateSiteSetting(parseInt(req.params.id), req.body);
      if (!setting) return res.status(404).json({ error: "Setting not found" });
      res.json(setting);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  // ---------- ADMINS ----------
  app.get("/api/admins", requireSuperAdmin, async (req, res) => {
    try { res.json(await storage.getAllAdmins()); }
    catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/admins", requireSuperAdmin, async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
      }
      const existing = await storage.getAdminByEmail(email);
      if (existing) return res.status(409).json({ error: "Admin already exists" });
      // ---------- ADMINS ----------
// Add this DELETE handler to server/routes.ts (near other /api/admins handlers)
app.delete("/api/admins/:id", requireSuperAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // req.adminId should be set by requireSuperAdmin/requireAdmin middleware
    // prevent deleting yourself
    if ((req as any).adminId === id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    // check admin exists
    const existing = await storage.getAdminById(id);
    if (!existing) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // If the target is a super-admin, ensure we don't delete the last super-admin
    if (existing.role === "super-admin") {
      const allAdmins = await storage.getAllAdmins();
      const superAdminCount = allAdmins.filter((a) => a.role === "super-admin").length;
      if (superAdminCount <= 1) {
        return res.status(400).json({ error: "Cannot delete the last super-admin account" });
      }
    }

    // perform delete
    await storage.deleteAdmin(id);

    // success (204 No Content)
    res.status(204).send();
  } catch (e: any) {
    console.error("DELETE /api/admins/:id error:", e);
    res.status(500).json({ error: e.message });
  }
});

      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await storage.createAdmin({ name, email, passwordHash, role: role || "admin" });
      res.status(201).json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  return createServer(app);
}
