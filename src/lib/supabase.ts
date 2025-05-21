
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Get environment variables with fallback empty strings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure we have values before creating the client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL and Anon Key are required. Please make sure you've set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://your-project.supabase.co",
  supabaseAnonKey || "your-anon-key"
);
