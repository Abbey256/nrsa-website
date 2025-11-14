import { 
  type User, type InsertUser, type Admin, type InsertAdmin,
  type HeroSlide, type InsertHeroSlide, 
  type News, type InsertNews, type Event, type InsertEvent,
  type Player, type InsertPlayer, type Club, type InsertClub,
  type MemberState, type InsertMemberState, memberStates,
  type Leader, type InsertLeader, type Media, type InsertMedia,
  type Affiliation, type InsertAffiliation, type Contact, type InsertContact,
  type SiteSetting, type InsertSiteSetting,
  users, admins, heroSlides, news, events, players, clubs, leaders,
  media, affiliations, contacts, siteSettings
} from "@shared/schema";

import { supabase } from "./lib/supabase.js";

// Helper functions to convert between camelCase and snake_case
function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;
  
  const snakeObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    snakeObj[snakeKey] = toSnakeCase(obj[key]);
  }
  return snakeObj;
}

function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;
  
  const camelObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelObj[camelKey] = toCamelCase(obj[key]);
  }
  return camelObj;
}

export const storage = {
  // Admin methods
  getAdminByEmail: async (email: string) => {
    if (!supabase) return undefined;
    try {
      const { data, error } = await supabase.from('admins').select('*').eq('email', email).maybeSingle();
      if (error) throw error;
      return toCamelCase(data) || undefined;
    } catch (error: any) {
      console.error('Error getting admin by email:', error.message);
      return undefined;
    }
  },
  getAdminById: async (id: number) => {
    if (!supabase) return undefined;
    try {
      const { data, error } = await supabase.from('admins').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return toCamelCase(data) || undefined;
    } catch (error: any) {
      console.error('Error getting admin by ID:', error.message);
      return undefined;
    }
  },
  createAdmin: async (adminData: InsertAdmin) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('admins').insert(toSnakeCase(adminData)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  getAllAdmins: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('admins').select('id, name, email, role, created_at').order('created_at', { ascending: false });
    return toCamelCase(data) || [];
  },
  updateAdmin: async (id: number, data: Partial<Admin>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('admins').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteAdmin: async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase.from('admins').delete().eq('id', id);
    if (error) throw error;
  },
  // News
  getAllNews: async (limit = 50, offset = 0) => {
    if (!supabase) return [];
    const { data } = await supabase
      .from('news')
      .select('id, title, content, image_url, published_at, created_at')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return toCamelCase(data) || [];
  },
  getNews: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('news').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createNews: async (article: InsertNews) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('news').insert(toSnakeCase(article)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateNews: async (id: number, data: Partial<InsertNews>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('news').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteNews: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error, count } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    if (count === 0) throw new Error('Item not found');
  },

  // Events
  getAllEvents: async () => {
    if (!supabase) {
      console.log('🔍 [EVENTS DEBUG] No supabase client');
      return [];
    }
    console.log('🔍 [EVENTS DEBUG] Fetching events from database...');
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    console.log('🔍 [EVENTS DEBUG] Raw database response:', { data, error, count: data?.length });
    const result = toCamelCase(data) || [];
    console.log('🔍 [EVENTS DEBUG] Processed result:', result);
    return result;
  },
  getEvent: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createEvent: async (event: InsertEvent) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('events').insert(toSnakeCase(event)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateEvent: async (id: number, data: Partial<InsertEvent>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('events').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteEvent: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error, count } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    if (count === 0) throw new Error('Item not found');
  },

  // Players
  getAllPlayers: async () => {
    if (!supabase) return [];
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('name');
    return toCamelCase(data) || [];
  },
  getPlayer: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('players').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createPlayer: async (player: InsertPlayer) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('players').insert(toSnakeCase(player)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updatePlayer: async (id: number, data: Partial<InsertPlayer>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('players').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deletePlayer: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error, count } = await supabase.from('players').delete().eq('id', id);
    if (error) throw error;
    if (count === 0) throw new Error('Item not found');
  },

  // Clubs
  getAllClubs: async () => {
    if (!supabase) {
      console.log('🔍 [CLUBS DEBUG] No supabase client');
      return [];
    }
    console.log('🔍 [CLUBS DEBUG] Fetching clubs from database...');
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('name');
    console.log('🔍 [CLUBS DEBUG] Raw database response:', { data, error, count: data?.length });
    const result = toCamelCase(data) || [];
    console.log('🔍 [CLUBS DEBUG] Processed result:', result);
    return result;
  },
  getClub: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('clubs').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createClub: async (club: InsertClub) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('clubs').insert(toSnakeCase(club)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateClub: async (id: number, data: Partial<InsertClub>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('clubs').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteClub: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error, count } = await supabase.from('clubs').delete().eq('id', id);
    if (error) throw error;
    if (count === 0) throw new Error('Item not found');
  },

  // Leaders
  getAllLeaders: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('leaders').select('*').order('order');
      if (error) throw error;
      return toCamelCase(data) || [];
    } catch (error: any) {
      console.error('Error getting all leaders:', error.message);
      return [];
    }
  },
  getLeader: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('leaders').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createLeader: async (leader: InsertLeader) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('leaders').insert(toSnakeCase(leader)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateLeader: async (id: number, data: Partial<InsertLeader>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('leaders').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteLeader: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error, count } = await supabase.from('leaders').delete().eq('id', id);
    if (error) throw error;
    if (count === 0) throw new Error('Item not found');
  },

  // Media
  getAllMedia: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    return toCamelCase(data) || [];
  },
  getMediaItem: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('media').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createMedia: async (item: InsertMedia) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('media').insert(toSnakeCase(item)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateMedia: async (id: number, data: Partial<InsertMedia>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('media').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteMedia: async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
  },

  // Contacts
  getAllContacts: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    return toCamelCase(data) || [];
  },
  createContact: async (contact: InsertContact) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('contacts').insert(toSnakeCase(contact)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateContact: async (id: number, data: any) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('contacts').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteContact: async (id: number) => {
    if (!supabase) throw new Error('Database not available');
    const { error, count } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    if (count === 0) throw new Error('Item not found');
  },

  // Site Settings
  getAllSiteSettings: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('site_settings').select('*');
    return toCamelCase(data) || [];
  },
  createSiteSetting: async (setting: InsertSiteSetting) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('site_settings').insert(toSnakeCase(setting)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateSiteSetting: async (id: number, data: Partial<InsertSiteSetting>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('site_settings').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteSiteSetting: async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase.from('site_settings').delete().eq('id', id);
    if (error) throw error;
  },

  // Member States
  getAllMemberStates: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('member_states').select('*').order('name');
    return toCamelCase(data) || [];
  },
  getMemberState: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error} = await supabase.from('member_states').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createMemberState: async (state: InsertMemberState) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('member_states').insert(toSnakeCase(state)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateMemberState: async (id: number, data: Partial<InsertMemberState>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('member_states').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteMemberState: async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase.from('member_states').delete().eq('id', id);
    if (error) throw error;
  },

  // Hero Slides
  getAllHeroSlides: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('hero_slides').select('*').order('id');
    return toCamelCase(data) || [];
  },
  getHeroSlide: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('hero_slides').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return toCamelCase(data) || undefined;
  },
  createHeroSlide: async (slide: InsertHeroSlide) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('hero_slides').insert(toSnakeCase(slide)).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(data);
  },
  updateHeroSlide: async (id: number, data: Partial<InsertHeroSlide>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('hero_slides').update(toSnakeCase(data)).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return toCamelCase(updated) || undefined;
  },
  deleteHeroSlide: async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    if (error) throw error;
  },

  // Affiliations
  getAllAffiliations: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('affiliations').select('*').order('order');
    return data || [];
  },
  getAffiliation: async (id: number) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('affiliations').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data || undefined;
  },
  createAffiliation: async (affiliation: InsertAffiliation) => {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from('affiliations').insert(affiliation).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  updateAffiliation: async (id: number, data: Partial<InsertAffiliation>) => {
    if (!supabase) return undefined;
    const { data: updated, error } = await supabase.from('affiliations').update(data).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return updated || undefined;
  },
  deleteAffiliation: async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase.from('affiliations').delete().eq('id', id);
    if (error) throw error;
  },
};
