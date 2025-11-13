// server/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables in order of priority
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.development' });
dotenv.config({ path: '.env.production' });
dotenv.config();

let supabase: SupabaseClient | null = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Initializing Supabase with URL:', process.env.SUPABASE_URL);
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  
  console.log('✅ Supabase client initialized');
} else {
  console.warn('❌ Supabase credentials not found - authentication will fail');
  console.log('Missing env vars:', {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY
  });
}

export { supabase };