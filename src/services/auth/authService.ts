import { supabase } from '../../lib/supabase';
import { AuthService } from './types';
import { AuthUser, SupabaseAuthUser } from './types/user';
import { mapUserFromProfile } from './mappers/userMapper';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService: AuthService = {
  async login(identifier: string, password: string): Promise<AuthUser> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        let email = identifier;
        
        // If identifier is not an email, look up email by username
        if (!identifier.includes('@')) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .maybeSingle();
          
          if (!profile?.email) {
            throw new Error('User not found');
          }
          email = profile.email;
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user data returned');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          throw new Error('Failed to load user profile');
        }

        const supabaseUser = authData.user as SupabaseAuthUser;
        return mapUserFromProfile(profile, supabaseUser);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error occurred');
        console.warn(`Login attempt ${attempt + 1} failed:`, lastError);
        
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY * (attempt + 1));
        }
      }
    }

    throw lastError || new Error('Failed to login after multiple attempts');
  },

  async signup(formData: { email: string; password: string; username?: string; name?: string }): Promise<AuthUser> {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          full_name: formData.name
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Failed to create user account');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Failed to create user profile');
    }

    const supabaseUser = authData.user as SupabaseAuthUser;
    return mapUserFromProfile(profile, supabaseUser);
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
  }
};