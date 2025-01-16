import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    env: import.meta.env.MODE
  });
  throw new Error('Supabase configuration missing');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format:', error);
  throw new Error('Invalid Supabase URL format');
}

// Create Supabase client with persistent sessions
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'versobid-auth'
    },
    global: {
      headers: {
        'X-Client-Info': 'versobid-web'
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});