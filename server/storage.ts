import { 
  type User, type InsertUser, type Admin, type InsertAdmin,
  type HeroSlide, type InsertHeroSlide, 
  type News, type InsertNews, type Event, type InsertEvent,
  type Player, type InsertPlayer, type Club, type InsertClub,
  type Leader, type InsertLeader, type Media, type InsertMedia,
  type Affiliation, type InsertAffiliation, type Contact, type InsertContact,
  type SiteSetting, type InsertSiteSetting,
  users, admins, heroSlides, news, events, players, clubs, leaders,
  media, affiliations, contacts, siteSettings
} from "@shared/schema";

import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export const storage = {
  // Admin methods
  getAdminByEmail: async (email: string) => {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin || undefined;
  },
  getAdminById: async (id: number) => {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  },
  createAdmin: async (adminData: InsertAdmin) => {
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
  updateAdmin: async (id: number, data: Partial<Admin>) => {
    const [updated] = await db.update(admins).set(data).where(eq(admins.id, id)).returning();
    return updated || undefined;
  },
  deleteAdmin: async (id: number) => {
    await db.delete(admins).where(eq(admins.id, id));
  },
  // Users
  getUser: async (id: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  },
  getUserByUsername: async (username: string) => {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  },
  createUser: async (user: InsertUser) => {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  },

  // Hero Slides
  getAllHeroSlides: async () => {
    return await db.select().from(heroSlides).orderBy(heroSlides.order);
  },
  getHeroSlide: async (id: number) => {
    const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
    return slide || undefined;
  },
  createHeroSlide: async (slide: InsertHeroSlide) => {
    const [created] = await db.insert(heroSlides).values(slide).returning();
    return created;
  },
  updateHeroSlide: async (id: number, data: Partial<InsertHeroSlide>) => {
    const [updated] = await db.update(heroSlides).set(data).where(eq(heroSlides.id, id)).returning();
    return updated || undefined;
  },
  deleteHeroSlide: async (id: number) => {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
  },

  // News
  getAllNews: async () => {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  },
  getNews: async (id: number) => {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article || undefined;
  },
  createNews: async (article: InsertNews) => {
    const [created] = await db.insert(news).values(article).returning();
    return created;
  },
  updateNews: async (id: number, data: Partial<InsertNews>) => {
    const [updated] = await db.update(news).set(data).where(eq(news.id, id)).returning();
    return updated || undefined;
  },
  deleteNews: async (id: number) => {
    await db.delete(news).where(eq(news.id, id));
  },

  // Events
  getAllEvents: async () => {
    return await db.select().from(events).orderBy(desc(events.eventDate));
  },
  getEvent: async (id: number) => {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  },
  createEvent: async (event: InsertEvent) => {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  },
  updateEvent: async (id: number, data: Partial<InsertEvent>) => {
    const [updated] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return updated || undefined;
  },
  deleteEvent: async (id: number) => {
    await db.delete(events).where(eq(events.id, id));
  },

  // Players
  getAllPlayers: async () => {
    return await db.select().from(players).orderBy(desc(players.totalPoints));
  },
  getPlayer: async (id: number) => {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  },
  createPlayer: async (player: InsertPlayer) => {
    const [created] = await db.insert(players).values(player).returning();
    return created;
  },
  updatePlayer: async (id: number, data: Partial<InsertPlayer>) => {
    const [updated] = await db.update(players).set(data).where(eq(players.id, id)).returning();
    return updated || undefined;
  },
  deletePlayer: async (id: number) => {
    await db.delete(players).where(eq(players.id, id));
  },

  // Clubs
  getAllClubs: async () => {
    return await db.select().from(clubs).orderBy(clubs.name);
  },
  getClub: async (id: number) => {
    const [club] = await db.select().from(clubs).where(eq(clubs.id, id));
    return club || undefined;
  },
  createClub: async (club: InsertClub) => {
    const [created] = await db.insert(clubs).values(club).returning();
    return created;
  },
  updateClub: async (id: number, data: Partial<InsertClub>) => {
    const [updated] = await db.update(clubs).set(data).where(eq(clubs.id, id)).returning();
    return updated || undefined;
  },
  deleteClub: async (id: number) => {
    await db.delete(clubs).where(eq(clubs.id, id));
  },

  // Leaders
  getAllLeaders: async () => {
    return await db.select().from(leaders).orderBy(leaders.order);
  },
  getLeader: async (id: number) => {
    const [leader] = await db.select().from(leaders).where(eq(leaders.id, id));
    return leader || undefined;
  },
  createLeader: async (leader: InsertLeader) => {
    const [created] = await db.insert(leaders).values(leader).returning();
    return created;
  },
  updateLeader: async (id: number, data: Partial<InsertLeader>) => {
    const [updated] = await db.update(leaders).set(data).where(eq(leaders.id, id)).returning();
    return updated || undefined;
  },
  deleteLeader: async (id: number) => {
    await db.delete(leaders).where(eq(leaders.id, id));
  },

  // Media
  getAllMedia: async () => {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  },
  getMediaItem: async (id: number) => {
    const [item] = await db.select().from(media).where(eq(media.id, id));
    return item || undefined;
  },
  createMedia: async (item: InsertMedia) => {
    const [created] = await db.insert(media).values(item).returning();
    return created;
  },
  updateMedia: async (id: number, data: Partial<InsertMedia>) => {
    const [updated] = await db.update(media).set(data).where(eq(media.id, id)).returning();
    return updated || undefined;
  },
  deleteMedia: async (id: number) => {
    await db.delete(media).where(eq(media.id, id));
  },

  // Affiliations
  getAllAffiliations: async () => {
    return await db.select().from(affiliations).orderBy(affiliations.order);
  },
  createAffiliation: async (affiliation: InsertAffiliation) => {
    const [created] = await db.insert(affiliations).values(affiliation).returning();
    return created;
  },
  updateAffiliation: async (id: number, data: Partial<InsertAffiliation>) => {
    const [updated] = await db.update(affiliations).set(data).where(eq(affiliations.id, id)).returning();
    return updated || undefined;
  },
  deleteAffiliation: async (id: number) => {
    await db.delete(affiliations).where(eq(affiliations.id, id));
  },

  // Contacts
  getAllContacts: async () => {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  },
  createContact: async (contact: InsertContact) => {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  },
  updateContact: async (id: number, data: Partial<InsertContact>) => {
    const [updated] = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
    return updated || undefined;
  },
  deleteContact: async (id: number) => {
    await db.delete(contacts).where(eq(contacts.id, id));
  },

  // Site Settings
  getAllSiteSettings: async () => {
    return await db.select().from(siteSettings);
  },
  createSiteSetting: async (setting: InsertSiteSetting) => {
    const [created] = await db.insert(siteSettings).values(setting).returning();
    return created;
  },
  updateSiteSetting: async (id: number, data: Partial<InsertSiteSetting>) => {
    const [updated] = await db.update(siteSettings).set(data).where(eq(siteSettings.id, id)).returning();
    return updated || undefined;
  },
  deleteSiteSetting: async (id: number) => {
    await db.delete(siteSettings).where(eq(siteSettings.id, id));
  },
};
