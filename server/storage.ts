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

export const storage = {
  // Admin methods
  getAdminByEmail: async (email: string) => {
    if (!supabase) return undefined;
    try {
      const { data, error } = await supabase.from('admins').select('*').eq('email', email).single();
      if (error) throw error;
      return data || undefined;
    } catch (error: any) {
      console.error('Error getting admin by email:', error.message);
      return undefined;
    }
  },
  getAdminById: async (id: number) => {
    if (!supabase) return undefined;
    try {
      const { data, error } = await supabase.from('admins').select('*').eq('id', id).single();
      if (error) throw error;
      return data || undefined;
    } catch (error: any) {
      console.error('Error getting admin by ID:', error.message);
      return undefined;
    }
  },
  createAdmin: async (adminData: InsertAdmin) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('admins').insert(adminData).select().single();
    return data;
  },
  getAllAdmins: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('admins').select('id, name, email, role, created_at').order('created_at', { ascending: false });
    return data || [];
  },
  updateAdmin: async (id: number, data: Partial<Admin>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('admins').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteAdmin: async (id: number) => {
    if (!supabase) return;
    await supabase.from('admins').delete().eq('id', id);
  },
  // News
  getAllNews: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
    return data || [];
  },
  getNews: async (id: number) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('news').select('*').eq('id', id).single();
    return data || undefined;
  },
  createNews: async (article: InsertNews) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('news').insert(article).select().single();
    return data;
  },
  updateNews: async (id: number, data: Partial<InsertNews>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('news').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteNews: async (id: number) => {
    if (!supabase) return;
    await supabase.from('news').delete().eq('id', id);
  },

  // Events
  getAllEvents: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('events').select('*').order('date', { ascending: false });
    return data || [];
  },
  getEvent: async (id: number) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('events').select('*').eq('id', id).single();
    return data || undefined;
  },
  createEvent: async (event: InsertEvent) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('events').insert(event).select().single();
    return data;
  },
  updateEvent: async (id: number, data: Partial<InsertEvent>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('events').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteEvent: async (id: number) => {
    if (!supabase) return;
    await supabase.from('events').delete().eq('id', id);
  },

  // Players
  getAllPlayers: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('players').select('*').order('name');
    return data || [];
  },
  getPlayer: async (id: number) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('players').select('*').eq('id', id).single();
    return data || undefined;
  },
  createPlayer: async (player: InsertPlayer) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('players').insert(player).select().single();
    return data;
  },
  updatePlayer: async (id: number, data: Partial<InsertPlayer>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('players').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deletePlayer: async (id: number) => {
    if (!supabase) return;
    await supabase.from('players').delete().eq('id', id);
  },

  // Clubs
  getAllClubs: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('clubs').select('*').order('name');
    return data || [];
  },
  getClub: async (id: number) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('clubs').select('*').eq('id', id).single();
    return data || undefined;
  },
  createClub: async (club: InsertClub) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('clubs').insert(club).select().single();
    return data;
  },
  updateClub: async (id: number, data: Partial<InsertClub>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('clubs').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteClub: async (id: number) => {
    if (!supabase) return;
    await supabase.from('clubs').delete().eq('id', id);
  },

  // Leaders
  getAllLeaders: async () => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('leaders').select('*').order('order_index');
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error getting all leaders:', error.message);
      return [];
    }
  },
  getLeader: async (id: number) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('leaders').select('*').eq('id', id).single();
    return data || undefined;
  },
  createLeader: async (leader: InsertLeader) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('leaders').insert(leader).select().single();
    return data;
  },
  updateLeader: async (id: number, data: Partial<InsertLeader>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('leaders').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteLeader: async (id: number) => {
    if (!supabase) return;
    await supabase.from('leaders').delete().eq('id', id);
  },

  // Media
  getAllMedia: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    return data || [];
  },
  getMediaItem: async (id: number) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('media').select('*').eq('id', id).single();
    return data || undefined;
  },
  createMedia: async (item: InsertMedia) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('media').insert(item).select().single();
    return data;
  },
  updateMedia: async (id: number, data: Partial<InsertMedia>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('media').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteMedia: async (id: number) => {
    if (!supabase) return;
    await supabase.from('media').delete().eq('id', id);
  },

  // Contacts
  getAllContacts: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    return data || [];
  },
  createContact: async (contact: InsertContact) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('contacts').insert(contact).select().single();
    return data;
  },
  updateContact: async (id: number, data: Partial<InsertContact>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('contacts').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteContact: async (id: number) => {
    if (!supabase) return;
    await supabase.from('contacts').delete().eq('id', id);
  },

  // Site Settings
  getAllSiteSettings: async () => {
    if (!supabase) return [];
    const { data } = await supabase.from('site_settings').select('*');
    return data || [];
  },
  createSiteSetting: async (setting: InsertSiteSetting) => {
    if (!supabase) return undefined;
    const { data } = await supabase.from('site_settings').insert(setting).select().single();
    return data;
  },
  updateSiteSetting: async (id: number, data: Partial<InsertSiteSetting>) => {
    if (!supabase) return undefined;
    const { data: updated } = await supabase.from('site_settings').update(data).eq('id', id).select().single();
    return updated || undefined;
  },
  deleteSiteSetting: async (id: number) => {
    if (!supabase) return;
    await supabase.from('site_settings').delete().eq('id', id);
  },
};
