import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Admins
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Hero Slides
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({
  id: true,
  createdAt: true,
});

export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type HeroSlide = typeof heroSlides.$inferSelect;

// News Articles
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * News insert schema with date string handling
 * Accepts date strings from API and converts them to Date objects
 */
export const insertNewsSchema = createInsertSchema(news, {
  publishedAt: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  eventDate: timestamp("event_date").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Event insert schema with date string handling
 * Accepts date strings from API and converts them to Date objects
 */
export const insertEventSchema = createInsertSchema(events, {
  eventDate: z.union([z.date(), z.string().transform((str) => new Date(str))]),
  registrationDeadline: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

/**
 * Players Table
 * Stores scrabble player profiles with statistics and information
 * 
 * New fields added:
 * - awardsWon: Number of awards/titles won by the player
 * - gamesPlayed: Total number of games played
 * - biography: Detailed player biography and background
 */
export const players = pgTable("players", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Clubs
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  managerName: text("manager_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  isRegistered: boolean("is_registered").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true,
});

export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;

// Federation Leaders
export const leaders = pgTable("leaders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeaderSchema = createInsertSchema(leaders).omit({
  id: true,
  createdAt: true,
});

export type InsertLeader = z.infer<typeof insertLeaderSchema>;
export type Leader = typeof leaders.$inferSelect;

// Media Gallery
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// Affiliations
export const affiliations = pgTable("affiliations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website"),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliationSchema = createInsertSchema(affiliations).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliation = z.infer<typeof insertAffiliationSchema>;
export type Affiliation = typeof affiliations.$inferSelect;

// Contact Submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Site Settings
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
