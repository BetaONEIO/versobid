import { supabase } from '../../lib/supabase';
import { AuthService } from './types';
import { AuthUser, SupabaseAuthUser } from './types/user';
import { mapUserFromProfile } from './mappers/userMapper';
import { AuthFormData } from '../../types/auth';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const BACKOFF_FACTOR = 1.5;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryableError = (error: any) => {
  return error?.name === 'AuthRetryableFetchError' || 
         error?.status === 0 ||
         error?.message?.includes('network');
};

const logError = (stage: string, error: any) => {
  console.error(`[Auth Error] ${stage}:`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    status: error?.status,
    statusText: error?.statusText,
    stack: error?.stack,
    timestamp: new Date().toISOString()
  });
};

export const authService: AuthService = {
  async login(identifier: string, password: string): Promise<AuthUser> {
    let lastError: Error | null = null;
    console.log('[Auth] Starting login process:', { identifier });
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        let email = identifier;
        
        if (!identifier.includes('@')) {
          console.log('[Auth] Looking up email by username');
          const { data: profile, error: lookupError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .maybeSingle();
          
          if (lookupError) {
            logError('Email lookup', lookupError);
            throw new Error('Failed to lookup user email');
          }
          
          if (!profile?.email) {
            throw new Error('User not found');
          }
          email = profile.email;
          console.log('[Auth] Found email for username');
        }

        console.log('[Auth] Attempting sign in');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          logError('Sign in', authError);
          throw authError;
        }

        if (!authData.user) {
          throw new Error('No user data returned');
        }

        console.log('[Auth] Fetching user profile');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          logError('Profile fetch', profileError);
          throw new Error('Failed to load user profile');
        }

        if (!profile) {
          throw new Error('Profile not found');
        }

        const supabaseUser = authData.user as SupabaseAuthUser;
        console.log('[Auth] Login successful');
        return mapUserFromProfile(profile, supabaseUser);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error occurred');
        console.warn(`[Auth] Login attempt ${attempt + 1} failed:`, lastError);
        
        if (isRetryableError(error) && attempt < MAX_RETRIES - 1) {
          const delay = RETRY_DELAY * Math.pow(BACKOFF_FACTOR, attempt);
          await sleep(delay);
          continue;
        }
        
        throw lastError;
      }
    }

    throw lastError || new Error('Failed to login after multiple attempts');
  },

  async signup(formData: AuthFormData): Promise<AuthUser> {
    console.log('[Auth] Starting signup process');
    
    try {
      // Check for existing user
      console.log('[Auth] Checking for existing user');
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email, username')
        .or(`email.eq.${formData.email},username.eq.${formData.username}`)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        logError('Existing user check', checkError);
        throw new Error(`Failed to check existing user: ${checkError.message}`);
      }

      if (existingUser?.email === formData.email) {
        throw new Error('Email already registered');
      }

      if (existingUser?.username === formData.username) {
        throw new Error('Username already taken');
      }

      // Create auth user
      console.log('[Auth] Creating auth user');
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (signUpError) {
        logError('Auth signup', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      // Create profile
      console.log('[Auth] Creating user profile');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          username: formData.username,
          full_name: formData.name,
          created_at: new Date().toISOString(),
          is_admin: false
        }])
        .select()
        .single();

      if (profileError) {
        logError('Profile creation', profileError);
        // Clean up auth user if profile creation fails
        console.log('[Auth] Profile creation failed, cleaning up auth user');
        await supabase.auth.signOut();
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      if (!profile) {
        throw new Error('Profile creation succeeded but returned no data');
      }

      const supabaseUser = authData.user as SupabaseAuthUser;
      console.log('[Auth] Signup successful');
      return mapUserFromProfile(profile, supabaseUser);
    } catch (error) {
      logError('Signup process', error);
      throw error;
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    console.log('[Auth] Requesting password reset');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        logError('Password reset request', error);
        throw error;
      }
      console.log('[Auth] Password reset email sent');
    } catch (error) {
      logError('Password reset process', error);
      throw error;
    }
  }
};