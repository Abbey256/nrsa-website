import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (url && key) {
      supabaseClient = createClient(url, key);
      console.log('✅ Supabase initialized');
    } else {
      console.log('❌ Missing Supabase credentials');
      return null;
    }
  }
  return supabaseClient;
}

export const supabase = getSupabase();
export const initializeSupabase = getSupabase;