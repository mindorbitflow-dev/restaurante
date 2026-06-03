import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
const demoModeEnv = process.env.NEXT_PUBLIC_DEMO_MODE?.trim().toLowerCase();
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const demoModeEnabled =
  demoModeEnv === 'true' || (!hasSupabaseConfig && demoModeEnv !== 'false');

const supabaseConfigError = new Error(
  'Supabase credentials are missing. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable database features.'
);

type SupabaseLikeQuery = {
  select: (...args: any[]) => SupabaseLikeQuery;
  order: (...args: any[]) => SupabaseLikeQuery;
  is: (...args: any[]) => SupabaseLikeQuery;
  eq: (...args: any[]) => SupabaseLikeQuery;
  not: (...args: any[]) => SupabaseLikeQuery;
  lt: (...args: any[]) => SupabaseLikeQuery;
  limit: (...args: any[]) => SupabaseLikeQuery;
  maybeSingle: () => SupabaseLikeQuery;
  insert: (...args: any[]) => SupabaseLikeQuery;
  update: (...args: any[]) => SupabaseLikeQuery;
  delete: (...args: any[]) => SupabaseLikeQuery;
  then: Promise<{ data: null; error: Error }>['then'];
  catch: Promise<{ data: null; error: Error }>['catch'];
  finally: Promise<{ data: null; error: Error }>['finally'];
};

function createSupabaseFallbackQuery(): SupabaseLikeQuery {
  const result = Promise.resolve({ data: null, error: supabaseConfigError });

  let query: SupabaseLikeQuery;
  query = {
    select: () => query,
    order: () => query,
    is: () => query,
    eq: () => query,
    not: () => query,
    lt: () => query,
    limit: () => query,
    maybeSingle: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
  };

  return query;
}

const fallbackSupabase = {
  from: () => createSupabaseFallbackQuery(),
  auth: {
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: supabaseConfigError,
    }),
    signOut: async () => ({ error: supabaseConfigError }),
    updateUser: async () => ({
      data: { user: null },
      error: supabaseConfigError,
    }),
    getSession: async () => ({
      data: { session: null },
      error: supabaseConfigError,
    }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
  },
};

// Fallback message to prevent hard crashes when Supabase credentials are not set up yet.
if (!hasSupabaseConfig && demoModeEnabled) {
  if (typeof window !== 'undefined') {
    console.warn(
      "Supabase credentials are missing. The website is currently running in fallback 'Mock Mode'. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your env file to connect database features."
    );
  } else {
    console.warn(
      "\x1b[33m[Supabase Warning] Credentials missing. Running in Mock fallback mode. Please configure environment variables.\x1b[0m"
    );
  }
} else if (!hasSupabaseConfig) {
  console.warn(
    "\x1b[33m[Supabase Warning] Credentials missing and demo mode is disabled. Supabase features will fail until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are configured.\x1b[0m"
  );
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (fallbackSupabase as typeof fallbackSupabase & Record<string, any>);

export const isSupabaseConfigured = hasSupabaseConfig;
export const isDemoModeEnabled = demoModeEnabled;
