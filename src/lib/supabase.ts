import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback message to prevent hard crashes when supabase credentials are not set up yet
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      "Supabase credentials are missing. The website is currently running in fallback 'Mock Mode'. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your env file to connect database features."
    );
  } else {
    console.warn(
      "\x1b[33m[Supabase Warning] Credentials missing. Running in Mock fallback mode. Please configure environment variables.\x1b[0m"
    );
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
