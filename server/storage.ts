import { 
  type User, 
  type InsertUser,
  type HeroSlide,
  type InsertHeroSlide,
  type News,
  type InsertNews,
  type Event,
  type InsertEvent,
  type Player,
  type InsertPlayer,
  type Club,
  type InsertClub,
  type Leader,
  type InsertLeader,
  type Media,
  type InsertMedia,
  type Affiliation,
  type InsertAffiliation,
  type Contact,
  type InsertContact,
  type SiteSetting,
  type InsertSiteSetting,
  users,
  heroSlides,
  news,
  events,
  players,
  clubs,
  leaders,
  media,
  affiliations,
  contacts,
  siteSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hero Slides
  getAllHeroSlides(): Promise<HeroSlide[]>;
  getHeroSlide(id: number): Promise<HeroSlide | undefined>;
  createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide>;
  updateHeroSlide(id: number, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined>;
  deleteHeroSlide(id: number): Promise<boolean>;
  
  // News
  getAllNews(): Promise<News[]>;
  getNews(id: number): Promise<News | undefined>;
  createNews(article: InsertNews): Promise<News>;
  updateNews(id: number, article: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number): Promise<boolean>;
  
  // Events
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Players
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<boolean>;
  
  // Clubs
  getAllClubs(): Promise<Club[]>;
  getClub(id: number): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, club: Partial<InsertClub>): Promise<Club | undefined>;
  deleteClub(id: number): Promise<boolean>;
  
  // Leaders
  getAllLeaders(): Promise<Leader[]>;
  getLeader(id: number): Promise<Leader | undefined>;
  createLeader(leader: InsertLeader): Promise<Leader>;
  updateLeader(id: number, leader: Partial<InsertLeader>): Promise<Leader | undefined>;
  deleteLeader(id: number): Promise<boolean>;
  
  // Media
  getAllMedia(): Promise<Media[]>;
  getMediaItem(id: number): Promise<Media | undefined>;
  createMedia(item: InsertMedia): Promise<Media>;
  updateMedia(id: number, item: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<boolean>;
  
  // Affiliations
  getAllAffiliations(): Promise<Affiliation[]>;
  getAffiliation(id: number): Promise<Affiliation | undefined>;
  createAffiliation(affiliation: InsertAffiliation): Promise<Affiliation>;
  updateAffiliation(id: number, affiliation: Partial<InsertAffiliation>): Promise<Affiliation | undefined>;
  deleteAffiliation(id: number): Promise<boolean>;
  
  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: number): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  
  // Site Settings
  getAllSettings(): Promise<SiteSetting[]>;
  getSetting(key: string): Promise<SiteSetting | undefined>;
  setSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Hero Slides
  async getAllHeroSlides(): Promise<HeroSlide[]> {
    return db.select().from(heroSlides).orderBy(heroSlides.order);
  }

  async getHeroSlide(id: number): Promise<HeroSlide | undefined> {
    const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
    return slide || undefined;
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const [created] = await db.insert(heroSlides).values(slide).returning();
    return created;
  }

  async updateHeroSlide(id: number, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined> {
    const [updated] = await db.update(heroSlides).set(slide).where(eq(heroSlides.id, id)).returning();
    return updated || undefined;
  }

  async deleteHeroSlide(id: number): Promise<boolean> {
    const result = await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return true;
  }

  // News
  async getAllNews(): Promise<News[]> {
    return db.select().from(news).orderBy(desc(news.publishedAt));
  }

  async getNews(id: number): Promise<News | undefined> {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article || undefined;
  }

  async createNews(article: InsertNews): Promise<News> {
    const [created] = await db.insert(news).values(article).returning();
    return created;
  }

  async updateNews(id: number, article: Partial<InsertNews>): Promise<News | undefined> {
    const [updated] = await db.update(news).set(article).where(eq(news.id, id)).returning();
    return updated || undefined;
  }

  async deleteNews(id: number): Promise<boolean> {
    await db.delete(news).where(eq(news.id, id));
    return true;
  }

  // Events
  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(events.eventDate);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return updated || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    await db.delete(events).where(eq(events.id, id));
    return true;
  }

  // Players
  async getAllPlayers(): Promise<Player[]> {
    return db.select().from(players).orderBy(desc(players.totalPoints));
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [created] = await db.insert(players).values(player).returning();
    return created;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [updated] = await db.update(players).set(player).where(eq(players.id, id)).returning();
    return updated || undefined;
  }

  async deletePlayer(id: number): Promise<boolean> {
    await db.delete(players).where(eq(players.id, id));
    return true;
  }

  // Clubs
  async getAllClubs(): Promise<Club[]> {
    return db.select().from(clubs).orderBy(clubs.name);
  }

  async getClub(id: number): Promise<Club | undefined> {
    const [club] = await db.select().from(clubs).where(eq(clubs.id, id));
    return club || undefined;
  }

  async createClub(club: InsertClub): Promise<Club> {
    const [created] = await db.insert(clubs).values(club).returning();
    return created;
  }

  async updateClub(id: number, club: Partial<InsertClub>): Promise<Club | undefined> {
    const [updated] = await db.update(clubs).set(club).where(eq(clubs.id, id)).returning();
    return updated || undefined;
  }

  async deleteClub(id: number): Promise<boolean> {
    await db.delete(clubs).where(eq(clubs.id, id));
    return true;
  }

  // Leaders
  async getAllLeaders(): Promise<Leader[]> {
    return db.select().from(leaders).orderBy(leaders.order);
  }

  async getLeader(id: number): Promise<Leader | undefined> {
    const [leader] = await db.select().from(leaders).where(eq(leaders.id, id));
    return leader || undefined;
  }

  async createLeader(leader: InsertLeader): Promise<Leader> {
    const [created] = await db.insert(leaders).values(leader).returning();
    return created;
  }

  async updateLeader(id: number, leader: Partial<InsertLeader>): Promise<Leader | undefined> {
    const [updated] = await db.update(leaders).set(leader).where(eq(leaders.id, id)).returning();
    return updated || undefined;
  }

  async deleteLeader(id: number): Promise<boolean> {
    await db.delete(leaders).where(eq(leaders.id, id));
    return true;
  }

  // Media
  async getAllMedia(): Promise<Media[]> {
    return db.select().from(media).orderBy(desc(media.createdAt));
  }

  async getMediaItem(id: number): Promise<Media | undefined> {
    const [item] = await db.select().from(media).where(eq(media.id, id));
    return item || undefined;
  }

  async createMedia(item: InsertMedia): Promise<Media> {
    const [created] = await db.insert(media).values(item).returning();
    return created;
  }

  async updateMedia(id: number, item: Partial<InsertMedia>): Promise<Media | undefined> {
    const [updated] = await db.update(media).set(item).where(eq(media.id, id)).returning();
    return updated || undefined;
  }

  async deleteMedia(id: number): Promise<boolean> {
    await db.delete(media).where(eq(media.id, id));
    return true;
  }

  // Affiliations
  async getAllAffiliations(): Promise<Affiliation[]> {
    return db.select().from(affiliations).orderBy(affiliations.order);
  }

  async getAffiliation(id: number): Promise<Affiliation | undefined> {
    const [affiliation] = await db.select().from(affiliations).where(eq(affiliations.id, id));
    return affiliation || undefined;
  }

  async createAffiliation(affiliation: InsertAffiliation): Promise<Affiliation> {
    const [created] = await db.insert(affiliations).values(affiliation).returning();
    return created;
  }

  async updateAffiliation(id: number, affiliation: Partial<InsertAffiliation>): Promise<Affiliation | undefined> {
    const [updated] = await db.update(affiliations).set(affiliation).where(eq(affiliations.id, id)).returning();
    return updated || undefined;
  }

  async deleteAffiliation(id: number): Promise<boolean> {
    await db.delete(affiliations).where(eq(affiliations.id, id));
    return true;
  }

  // Contacts
  async getAllContacts(): Promise<Contact[]> {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  }

  async markContactAsRead(id: number): Promise<Contact | undefined> {
    const [updated] = await db.update(contacts).set({ isRead: true }).where(eq(contacts.id, id)).returning();
    return updated || undefined;
  }

  async deleteContact(id: number): Promise<boolean> {
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  }

  // Site Settings
  async getAllSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings);
  }

  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async setSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existing = await this.getSetting(setting.key);
    if (existing) {
      const [updated] = await db.update(siteSettings)
        .set({ value: setting.value, updatedAt: new Date() })
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siteSettings).values(setting).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
