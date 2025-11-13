// server/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && supabaseKey) {
  console.log('Initializing Supabase with URL:', supabaseUrl);
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.error('❌ Supabase initialization failed:', error);
  }
} else {
  console.warn('❌ Supabase credentials not found');
  console.log('Environment check:', {
    SUPABASE_URL: !!supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: !!supabaseKey,
    NODE_ENV: process.env.NODE_ENV
  });
}

export { supabase };