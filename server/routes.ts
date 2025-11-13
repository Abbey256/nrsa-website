import { Express } from "express";
import { storage } from "./storage.js";
import { supabase } from "./lib/supabase.js";
import { requireAdmin, requireSuperAdmin, type AdminRequest } from "./authMiddleware.js";
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
export function registerAllRoutes(app: Express): void {
  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({ status: "API is working", timestamp: new Date().toISOString() });
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      tables: {}
    };
    
    if (supabase) {
      const tables = ['leaders', 'news', 'events', 'players', 'clubs'];
      for (const table of tables) {
        try {
          await supabase.from(table).select('count').limit(0);
          health.tables[table] = 'ok';
        } catch (error: any) {
          console.error(`Health check failed for table ${table}:`, error?.message || error);
          health.tables[table] = 'error';
        }
      }
      health.database = Object.values(health.tables).includes('ok') ? 'connected' : 'error';
    }
    
    res.json(health);
  });

  // ---------- HERO SLIDES ----------
  app.get("/api/hero-slides", async (req, res) => {
    try {
      if (!supabase) return res.status(500).json({ error: "Database not configured" });
      const { data, error } = await supabase.from('hero_slides').select('*').order('id');
      if (error) throw error;
      res.json(data || []);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
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
    try {
      console.log('GET /api/news called');
      if (!supabase) {
        console.error('Supabase not configured');
        return res.status(500).json({ error: "Database not configured" });
      }
      const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false });
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('News data fetched:', data?.length || 0, 'items');
      res.json(data || []);
    } catch (e: any) { 
      console.error('News API error:', e.message);
      res.status(500).json({ error: e.message }); 
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
    try {
      if (!supabase) return res.status(500).json({ error: "Database not configured" });
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
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
    try {
      if (!supabase) return res.status(500).json({ error: "Database not configured" });
      const { data, error } = await supabase.from('players').select('*').order('name');
      if (error) throw error;
      res.json(data || []);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
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
    try {
      if (!supabase) return res.status(500).json({ error: "Database not configured" });
      const { data, error } = await supabase.from('clubs').select('*').order('name');
      if (error) throw error;
      res.json(data || []);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
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
    if (!supabase) return res.status(500).json({ error: "Database not configured" });
    const { data, error } = await supabase.from('member_states').select('*').order('name');
    if (error) throw error;
    res.json(data || []);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/member-states/:id", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const { data, error } = await supabase.from('member_states').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Member State not found" });
    res.json(data);
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
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const state = await storage.updateMemberState(id, req.body);
    if (!state) return res.status(404).json({ error: "Member State not found" });
    res.json(state);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/member-states/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await storage.deleteMemberState(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ---------- LEADERS ----------
app.get("/api/leaders", async (req, res) => {
  try {
    console.log('Leaders endpoint called');
    if (!supabase) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { data, error } = await supabase.from('leaders').select('*').order('order');
    if (error) throw error;
    console.log('Leaders data:', data);
    res.json(data || []);
  } catch (e: any) {
    console.error('Leaders endpoint error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Get a single leader by ID
app.get("/api/leaders/:id", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const { data, error } = await supabase.from('leaders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Leader not found" });
    res.json(data);
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
    if (!supabase) return res.status(500).json({ error: "Database not configured" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const updatedData = insertLeaderSchema.partial().parse(req.body);
    const { data, error } = await supabase.from('leaders').update(updatedData).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Leader not found" });
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/leaders/:id", requireAdmin, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured" });
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const { error } = await supabase.from('leaders').delete().eq('id', id);
    if (error) throw error;
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
    try {
      if (!supabase) return res.status(500).json({ error: "Database not configured" });
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      if (!supabase) return res.status(500).json({ error: "Database not configured" });
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const { data, error } = await supabase.from('media').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Media not found" });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
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
    const numericId = parseInt(id);
    if (isNaN(numericId)) return res.status(400).json({ error: "Invalid ID" });
    const updatedItem = await storage.updateMedia(numericId, {
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
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      await storage.deleteMedia(id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  

// ---------- CONTACTS ----------
app.post("/api/contacts", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured" });
    const contactData = insertContactSchema.parse(req.body);
    const { data, error } = await supabase.from('contacts').insert(contactData).select().maybeSingle();
    if (error) throw error;
    if (!data) return res.status(500).json({ error: "Failed to create contact" });
    res.status(201).json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Admin-only endpoints
app.get("/api/contacts", async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: "Database not configured" });
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/contacts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
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
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    const updated = await storage.updateContact(id, req.body);
    if (!updated) return res.status(404).json({ error: "Contact not found" });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete("/api/contacts/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await storage.deleteContact(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

  // ---------- SITE SETTINGS ----------
  app.get("/api/site-settings", async (req, res) => {
    try {
      if (!supabase) return res.status(500).json({ error: "Database not configured" });
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      res.json(data || []);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch("/api/site-settings/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
      const setting = await storage.updateSiteSetting(id, req.body);
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

      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await storage.createAdmin({ name, email, passwordHash, role: role || "admin" });
      res.status(201).json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  app.delete("/api/admins/:id", requireSuperAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

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
}
