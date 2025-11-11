import express from "express";
import { createServer as createServer$1 } from "http";
import rateLimit from "express-rate-limit";
import { sql, eq, desc } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { defineConfig, createLogger, createServer } from "vite";
import react from "@vitejs/plugin-react";
const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  protected: boolean("protected").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertAdminSchema = createInsertSchema(admins, {
  role: z.enum(["super-admin", "admin"]).default("admin")
}).omit({
  id: true,
  createdAt: true,
  protected: true
});
const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertHeroSlideSchema = createInsertSchema(heroSlides, {
  order: z.coerce.number().int({ message: "Order must be a whole number." }).nonnegative({ message: "Order cannot be negative." })
}).omit({
  id: true,
  createdAt: true
});
const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertNewsSchema = createInsertSchema(news, {
  publishedAt: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional()
}).omit({
  id: true,
  createdAt: true
});
const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  eventDate: timestamp("event_date").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  registrationLink: text("registration_link"),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertEventSchema = createInsertSchema(events, {
  eventDate: z.union([
    z.date(),
    z.string().transform((str) => new Date(str))
  ]),
  registrationDeadline: z.union([
    z.date(),
    z.string().transform((str) => str ? new Date(str) : void 0)
  ]).optional(),
  registrationLink: z.string().optional().refine((value) => !value || value.trim() === "" || /^https?:\/\/.+/.test(value), "Invalid URL format")
}).omit({
  id: true,
  createdAt: true
});
const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  club: text("club").notNull(),
  state: text("state").notNull(),
  category: text("category").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  achievements: text("achievements"),
  awardsWon: integer("awards_won").default(0),
  gamesPlayed: integer("games_played").default(0),
  biography: text("biography"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertPlayerSchema = createInsertSchema(players, {
  totalPoints: z.coerce.number().int({ message: "Total points must be a whole number." }).nonnegative({ message: "Total points cannot be negative." }),
  awardsWon: z.coerce.number().int({ message: "Awards won must be a whole number." }).nonnegative({ message: "Awards won cannot be negative." }),
  gamesPlayed: z.coerce.number().int({ message: "Games played must be a whole number." }).nonnegative({ message: "Games played cannot be negative." })
}).omit({
  id: true,
  createdAt: true
});
const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  managerName: text("manager_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  isRegistered: boolean("is_registered").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true
});
const memberStates = pgTable("member_states", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  representativeName: varchar("representative_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  isRegistered: boolean("is_registered").default(false)
});
const insertMemberStateSchema = createInsertSchema(memberStates).omit({
  id: true
});
const leaders = pgTable("leaders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertLeaderSchema = createInsertSchema(leaders, {
  order: z.coerce.number().int({ message: "Order must be a whole number." }).nonnegative({ message: "Order cannot be negative." })
}).omit({
  id: true,
  createdAt: true
});
const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  isExternal: boolean("is_external").notNull().default(false),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertMediaSchema = createInsertSchema(media, {
  isExternal: z.boolean().optional(),
  thumbnailUrl: z.string().nullable().optional()
}).omit({
  id: true,
  createdAt: true
});
const affiliations = pgTable("affiliations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website"),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertAffiliationSchema = createInsertSchema(affiliations, {
  order: z.coerce.number().int({ message: "Order must be a whole number." }).nonnegative({ message: "Order cannot be negative." })
}).omit({
  id: true,
  createdAt: true
});
const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  isRead: true
});
const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  admins,
  affiliations,
  clubs,
  contacts,
  events,
  heroSlides,
  insertAdminSchema,
  insertAffiliationSchema,
  insertClubSchema,
  insertContactSchema,
  insertEventSchema,
  insertHeroSlideSchema,
  insertLeaderSchema,
  insertMediaSchema,
  insertMemberStateSchema,
  insertNewsSchema,
  insertPlayerSchema,
  insertSiteSettingSchema,
  insertUserSchema,
  leaders,
  media,
  memberStates,
  news,
  players,
  siteSettings,
  users
}, Symbol.toStringTag, { value: "Module" }));
const { Pool } = pkg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set");
  throw new Error("DATABASE_URL must be set");
}
const pool = new Pool({
  connectionString: databaseUrl
});
const db = drizzle(pool, { schema });
const storage = {
  // Admin methods
  getAdminByEmail: async (email) => {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin || void 0;
  },
  getAdminById: async (id) => {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || void 0;
  },
  createAdmin: async (adminData) => {
    const [created] = await db.insert(admins).values(adminData).returning();
    return created;
  },
  /**
   * Get all admin accounts (excluding password hashes for security)
   * Used by admin management interface to list all administrators
   */
  getAllAdmins: async () => {
    return await db.select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      role: admins.role,
      protected: admins.protected,
      createdAt: admins.createdAt
    }).from(admins).orderBy(desc(admins.createdAt));
  },
  updateAdmin: async (id, data) => {
    const [updated] = await db.update(admins).set(data).where(eq(admins.id, id)).returning();
    return updated || void 0;
  },
  deleteAdmin: async (id) => {
    await db.delete(admins).where(eq(admins.id, id));
  },
  // Users
  getUser: async (id) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  },
  getUserByUsername: async (username) => {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  },
  createUser: async (user) => {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  },
  // Hero Slides
  getAllHeroSlides: async () => {
    return await db.select().from(heroSlides).orderBy(heroSlides.order);
  },
  getHeroSlide: async (id) => {
    const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
    return slide || void 0;
  },
  createHeroSlide: async (slide) => {
    const [created] = await db.insert(heroSlides).values(slide).returning();
    return created;
  },
  updateHeroSlide: async (id, data) => {
    const [updated] = await db.update(heroSlides).set(data).where(eq(heroSlides.id, id)).returning();
    return updated || void 0;
  },
  deleteHeroSlide: async (id) => {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
  },
  // News
  getAllNews: async () => {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  },
  getNews: async (id) => {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article || void 0;
  },
  createNews: async (article) => {
    const [created] = await db.insert(news).values(article).returning();
    return created;
  },
  updateNews: async (id, data) => {
    const [updated] = await db.update(news).set(data).where(eq(news.id, id)).returning();
    return updated || void 0;
  },
  deleteNews: async (id) => {
    await db.delete(news).where(eq(news.id, id));
  },
  // Events
  getAllEvents: async () => {
    return await db.select().from(events).orderBy(desc(events.eventDate));
  },
  getEvent: async (id) => {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || void 0;
  },
  createEvent: async (event) => {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  },
  updateEvent: async (id, data) => {
    const [updated] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return updated || void 0;
  },
  deleteEvent: async (id) => {
    await db.delete(events).where(eq(events.id, id));
  },
  // Players
  getAllPlayers: async () => {
    return await db.select().from(players).orderBy(desc(players.totalPoints));
  },
  getPlayer: async (id) => {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || void 0;
  },
  createPlayer: async (player) => {
    const [created] = await db.insert(players).values(player).returning();
    return created;
  },
  updatePlayer: async (id, data) => {
    const [updated] = await db.update(players).set(data).where(eq(players.id, id)).returning();
    return updated || void 0;
  },
  deletePlayer: async (id) => {
    await db.delete(players).where(eq(players.id, id));
  },
  // Clubs
  getAllClubs: async () => {
    return await db.select().from(clubs).orderBy(clubs.name);
  },
  getClub: async (id) => {
    const [club] = await db.select().from(clubs).where(eq(clubs.id, id));
    return club || void 0;
  },
  createClub: async (club) => {
    const [created] = await db.insert(clubs).values(club).returning();
    return created;
  },
  updateClub: async (id, data) => {
    const [updated] = await db.update(clubs).set(data).where(eq(clubs.id, id)).returning();
    return updated || void 0;
  },
  deleteClub: async (id) => {
    await db.delete(clubs).where(eq(clubs.id, id));
  },
  getAllMemberStates: async () => {
    return await db.select().from(memberStates).orderBy(memberStates.name);
  },
  getMemberState: async (id) => {
    const [state] = await db.select().from(memberStates).where(eq(memberStates.id, id));
    return state || void 0;
  },
  createMemberState: async (state) => {
    const [created] = await db.insert(memberStates).values(state).returning();
    return created;
  },
  updateMemberState: async (id, data) => {
    const [updated] = await db.update(memberStates).set(data).where(eq(memberStates.id, id)).returning();
    return updated || void 0;
  },
  deleteMemberState: async (id) => {
    await db.delete(memberStates).where(eq(memberStates.id, id));
  },
  // Leaders
  getAllLeaders: async () => {
    return await db.select().from(leaders).orderBy(leaders.order);
  },
  getLeader: async (id) => {
    const [leader] = await db.select().from(leaders).where(eq(leaders.id, id));
    return leader || void 0;
  },
  createLeader: async (leader) => {
    const [created] = await db.insert(leaders).values(leader).returning();
    return created;
  },
  updateLeader: async (id, data) => {
    const [updated] = await db.update(leaders).set(data).where(eq(leaders.id, id)).returning();
    return updated || void 0;
  },
  deleteLeader: async (id) => {
    await db.delete(leaders).where(eq(leaders.id, id));
  },
  // Media
  getAllMedia: async () => {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  },
  getMediaItem: async (id) => {
    const [item] = await db.select().from(media).where(eq(media.id, id));
    return item || void 0;
  },
  createMedia: async (item) => {
    const [created] = await db.insert(media).values(item).returning();
    return created;
  },
  updateMedia: async (id, data) => {
    const [updated] = await db.update(media).set(data).where(eq(media.id, id)).returning();
    return updated || void 0;
  },
  deleteMedia: async (id) => {
    await db.delete(media).where(eq(media.id, id));
  },
  // Affiliations
  getAllAffiliations: async () => {
    return await db.select().from(affiliations).orderBy(affiliations.order);
  },
  createAffiliation: async (affiliation) => {
    const [created] = await db.insert(affiliations).values(affiliation).returning();
    return created;
  },
  updateAffiliation: async (id, data) => {
    const [updated] = await db.update(affiliations).set(data).where(eq(affiliations.id, id)).returning();
    return updated || void 0;
  },
  deleteAffiliation: async (id) => {
    await db.delete(affiliations).where(eq(affiliations.id, id));
  },
  // Contacts
  getAllContacts: async () => {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  },
  createContact: async (contact) => {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  },
  updateContact: async (id, data) => {
    const [updated] = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
    return updated || void 0;
  },
  deleteContact: async (id) => {
    await db.delete(contacts).where(eq(contacts.id, id));
  },
  // Site Settings
  getAllSiteSettings: async () => {
    return await db.select().from(siteSettings);
  },
  createSiteSetting: async (setting) => {
    const [created] = await db.insert(siteSettings).values(setting).returning();
    return created;
  },
  updateSiteSetting: async (id, data) => {
    const [updated] = await db.update(siteSettings).set(data).where(eq(siteSettings.id, id)).returning();
    return updated || void 0;
  },
  deleteSiteSetting: async (id) => {
    await db.delete(siteSettings).where(eq(siteSettings.id, id));
  }
};
const JWT_SECRET$1 = process.env.JWT_SECRET || "dev-secret-change-in-production";
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET$1);
    req.adminId = decoded.adminId;
    req.adminRole = decoded.role;
    const admin = await storage.getAdminById(decoded.adminId);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized - Admin not found" });
    }
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Unauthorized - Invalid or expired token" });
  }
};
const requireSuperAdmin = async (req, res, next) => {
  await requireAdmin(req, res, async () => {
    if (req.adminRole !== "super-admin") {
      return res.status(403).json({ error: "Forbidden - Super admin access required" });
    }
    next();
  });
};
function registerAllRoutes(app2) {
  app2.get("/api/hero-slides", async (req, res) => {
    try {
      res.json(await storage.getAllHeroSlides());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/hero-slides", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.createHeroSlide(insertHeroSlideSchema.parse(req.body));
      res.status(201).json(slide);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      const slide = await storage.updateHeroSlide(parseInt(req.params.id), req.body);
      if (!slide) return res.status(404).json({ error: "Slide not found" });
      res.json(slide);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/hero-slides/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteHeroSlide(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      res.json(await storage.getAllNews());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getNews(id);
      if (!article) {
        return res.status(404).json({ error: "News not found" });
      }
      res.json(article);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const article = await storage.createNews(insertNewsSchema.parse(req.body));
      res.status(201).json(article);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      const article = await storage.updateNews(parseInt(req.params.id), req.body);
      if (!article) return res.status(404).json({ error: "News not found" });
      res.json(article);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/news/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteNews(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      res.json(await storage.getAllEvents());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const event = await storage.createEvent(insertEventSchema.parse(req.body));
      res.status(201).json(event);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const validatedBody = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(parseInt(req.params.id), validatedBody);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/players", async (req, res) => {
    try {
      res.json(await storage.getAllPlayers());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/players", requireAdmin, async (req, res) => {
    try {
      const player = await storage.createPlayer(insertPlayerSchema.parse(req.body));
      res.status(201).json(player);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      const player = await storage.updatePlayer(parseInt(req.params.id), req.body);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/players/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePlayer(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/clubs", async (req, res) => {
    try {
      res.json(await storage.getAllClubs());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/clubs", requireAdmin, async (req, res) => {
    try {
      const club = await storage.createClub(insertClubSchema.parse(req.body));
      res.status(201).json(club);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      const club = await storage.updateClub(parseInt(req.params.id), req.body);
      if (!club) return res.status(404).json({ error: "Club not found" });
      res.json(club);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/clubs/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteClub(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/member-states", async (req, res) => {
    try {
      res.json(await storage.getAllMemberStates());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/member-states/:id", async (req, res) => {
    try {
      const state = await storage.getMemberState(parseInt(req.params.id));
      if (!state) return res.status(404).json({ error: "Member State not found" });
      res.json(state);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/member-states", requireAdmin, async (req, res) => {
    try {
      const state = await storage.createMemberState(insertMemberStateSchema.parse(req.body));
      res.status(201).json(state);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/member-states/:id", requireAdmin, async (req, res) => {
    try {
      const state = await storage.updateMemberState(parseInt(req.params.id), req.body);
      if (!state) return res.status(404).json({ error: "Member State not found" });
      res.json(state);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/member-states/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMemberState(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/leaders", async (req, res) => {
    try {
      res.json(await storage.getAllLeaders());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/leaders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leader = await storage.getLeader(id);
      if (!leader) return res.status(404).json({ error: "Leader not found" });
      res.json(leader);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/leaders", requireAdmin, async (req, res) => {
    try {
      const leader = await storage.createLeader(insertLeaderSchema.parse(req.body));
      res.status(201).json(leader);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/leaders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedData = insertLeaderSchema.partial().parse(req.body);
      const leader = await storage.updateLeader(id, updatedData);
      if (!leader) return res.status(404).json({ error: "Leader not found" });
      res.json(leader);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/leaders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLeader(id);
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  function extractYouTubeVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  app2.get("/api/media", async (req, res) => {
    try {
      res.json(await storage.getAllMedia());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/media/:id", async (req, res) => {
    try {
      const item = await storage.getMediaItem(parseInt(req.params.id));
      if (!item) return res.status(404).json({ error: "Media not found" });
      res.json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const body = req.body;
      let mediaData = {
        title: body.title,
        description: body.description,
        category: body.category
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
        thumbnailUrl: mediaData.thumbnailUrl
      });
      res.status(201).json(item);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.patch("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;
      let updateData = {
        title: body.title,
        description: body.description,
        category: body.category
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
        thumbnailUrl: updateData.thumbnailUrl
      });
      if (!updatedItem) return res.status(404).json({ error: "Media not found" });
      res.json(updatedItem);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMedia(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/contacts", async (req, res) => {
    try {
      const contact = await storage.createContact(insertContactSchema.parse(req.body));
      res.status(201).json(contact);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.get("/api/contacts", requireAdmin, async (req, res) => {
    try {
      res.json(await storage.getAllContacts());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const all = await storage.getAllContacts();
      const item = all.find((c) => c.id === id);
      if (!item) return res.status(404).json({ error: "Contact not found" });
      res.json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.patch("/api/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateContact(id, req.body);
      if (!updated) return res.status(404).json({ error: "Contact not found" });
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/contacts/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteContact(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.get("/api/site-settings", async (req, res) => {
    try {
      res.json(await storage.getAllSiteSettings());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.patch("/api/site-settings/:id", requireAdmin, async (req, res) => {
    try {
      const setting = await storage.updateSiteSetting(parseInt(req.params.id), req.body);
      if (!setting) return res.status(404).json({ error: "Setting not found" });
      res.json(setting);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.get("/api/admins", requireSuperAdmin, async (req, res) => {
    try {
      res.json(await storage.getAllAdmins());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app2.post("/api/admins", requireSuperAdmin, async (req, res) => {
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
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
  app2.delete("/api/admins/:id", requireSuperAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (req.adminId === id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      const existing = await storage.getAdminById(id);
      if (!existing) {
        return res.status(404).json({ error: "Admin not found" });
      }
      if (existing.role === "super-admin") {
        const allAdmins = await storage.getAllAdmins();
        const superAdminCount = allAdmins.filter((a) => a.role === "super-admin").length;
        if (superAdminCount <= 1) {
          return res.status(400).json({ error: "Cannot delete the last super-admin account" });
        }
      }
      await storage.deleteAdmin(id);
      res.status(204).send();
    } catch (e) {
      console.error("DELETE /api/admins/:id error:", e);
      res.status(500).json({ error: e.message });
    }
  });
}
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
function registerAuthRoutes(app2) {
  app2.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await storage.getAdminByEmail(email);
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  });
}
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn("Supabase credentials not found - file upload features will be disabled");
}
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Only images are allowed."));
  }
});
router.post("/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (req.body.url) {
      const url = req.body.url.trim();
      let thumbnail = null;
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) {
        const videoId = ytMatch[1];
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      return res.status(200).json({
        type: ytMatch ? "youtube" : "external",
        url,
        thumbnail,
        message: "External media link stored successfully"
      });
    }
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!supabase) {
      return res.status(503).json({
        error: "File upload service not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
      });
    }
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    const filepath = `uploads/${filename}`;
    const { data, error } = await supabase.storage.from("nrsa-uploads").upload(filepath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false
    });
    if (error) {
      console.error("Supabase storage error:", error);
      return res.status(500).json({ error: error.message });
    }
    const { data: publicData } = supabase.storage.from("nrsa-uploads").getPublicUrl(data.path);
    res.status(200).json({
      type: "image",
      url: publicData.publicUrl,
      message: "File uploaded successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});
function registerUploadRoutes(app2) {
  app2.use("/api", router);
}
const viteConfig = defineConfig(async () => {
  const plugins = [
    react({
      jsxRuntime: "automatic"
    })
  ];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0) {
    try {
      const { default: runtimeErrorOverlay } = await import("@replit/vite-plugin-runtime-error-modal");
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      const { devBanner } = await import("@replit/vite-plugin-dev-banner");
      plugins.push(runtimeErrorOverlay());
      plugins.push(cartographer());
      plugins.push(devBanner());
    } catch (err) {
      console.warn("⚠️ Replit dev plugins not found — skipping (safe to ignore in production)");
    }
  }
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets")
      }
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true
    },
    server: {
      fs: {
        strict: false
      }
    }
  };
});
const viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server2) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server: server2 },
    allowedHosts: true
  };
  const clientRoot = path.resolve(import.meta.dirname, "..", "client");
  const vite = await createServer({
    ...viteConfig,
    configFile: false,
    root: clientRoot,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "..", "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "..", "shared"),
        "@assets": path.resolve(import.meta.dirname, "..", "attached_assets")
      }
    },
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build output directory at: ${distPath}. Run 'npm run build' first.`
    );
  }
  log(`Serving static files from: ${distPath}`, "express");
  app2.use(express.static(distPath));
  app2.use("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
const app = express();
app.use(express.json());
app.set("trust proxy", 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
}));
app.use((req, res, next) => {
  const start = Date.now();
  let jsonResponse = null;
  const originalJson = res.json.bind(res);
  res.json = function(body) {
    jsonResponse = body;
    return originalJson(body);
  };
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (jsonResponse) logLine += ` :: ${JSON.stringify(jsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      console.log(logLine);
    }
  });
  next();
});
registerAuthRoutes(app);
registerUploadRoutes(app);
registerAllRoutes(app);
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
}
const server = createServer$1(app);
const PORT = process.env.NODE_ENV === "production" ? parseInt(process.env.PORT || "10000") : 5e3;
(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  }
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();
