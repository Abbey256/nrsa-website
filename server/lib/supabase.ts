// server/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import "dotenv/config";

let supabase: SupabaseClient | null = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn('Supabase credentials not found - file upload features will be disabled');
}

export { supabase };