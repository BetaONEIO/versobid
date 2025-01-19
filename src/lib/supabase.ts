import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { getEnvVar, validateEnv } from '../utils/env';

// Validate environment variables
if (!validateEnv()) {
  console.error('[Supabase] Environment validation failed');
  throw new Error('Invalid environment configuration');
}

// Get environment variables
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', true)!;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', true)!;

console.log('[Supabase] Initializing client with config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  timestamp: new Date().toISOString()
});

// Create Supabase client with enhanced retry configuration
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'versobid-auth',
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'versobid-web'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Initialize auth state with error handling
supabase.auth.onAuthStateChange((event, session) => {
  try {
    console.log('[Supabase] Auth state change:', {
      event,
      userId: session?.user?.id,
      email: session?.user?.email,
      timestamp: new Date().toISOString()
    });

    if (event === 'SIGNED_IN') {
      console.log('[Supabase] User signed in:', {
        email: session?.user?.email,
        id: session?.user?.id,
        timestamp: new Date().toISOString()
      });
    } else if (event === 'SIGNED_OUT') {
      console.log('[Supabase] User signed out');
      localStorage.removeItem('versobid-user-data');
    } else if (event === 'USER_UPDATED') {
      console.log('[Supabase] User profile updated:', {
        id: session?.user?.id,
        timestamp: new Date().toISOString()
      });
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('[Supabase] Auth token refreshed:', {
        id: session?.user?.id,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('[Supabase] Auth state change error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Add health check function
export const checkSupabaseConnection = async () => {
  console.log('[Supabase] Checking connection...');
  try {
    const startTime = performance.now();
    const { error } = await supabase.from('profiles').select('count');
    const duration = performance.now() - startTime;
    
    const isConnected = !error;
    console.log('[Supabase] Connection check result:', {
      isConnected,
      duration: `${duration.toFixed(2)}ms`,
      error: error?.message,
      code: error?.code,
      details: error?.details,
      timestamp: new Date().toISOString()
    });
    
    return isConnected;
  } catch (error) {
    console.error('[Supabase] Connection check failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};

// Add retry helper with enhanced logging
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[Supabase] Retry attempt ${attempt + 1}/${maxRetries}`, {
        timestamp: new Date().toISOString()
      });
      
      const startTime = performance.now();
      const result = await operation();
      const duration = performance.now() - startTime;
      
      console.log(`[Supabase] Operation succeeded on attempt ${attempt + 1}`, {
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`[Supabase] Retry attempt ${attempt + 1} failed:`, {
        error: lastError.message,
        code: (error as any)?.code,
        details: (error as any)?.details,
        stack: lastError.stack,
        timestamp: new Date().toISOString()
      });
      
      if (attempt < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, attempt);
        console.log(`[Supabase] Waiting ${backoffDelay}ms before next retry`, {
          attempt: attempt + 1,
          maxRetries,
          timestamp: new Date().toISOString()
        });
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      throw lastError;
    }
  }
  
  throw lastError!;
};