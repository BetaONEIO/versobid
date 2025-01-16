import { supabase } from '../lib/supabase';
import { AuthFormData, User } from '../types';
import { profileService } from './profileService';
import { SupabaseAuthUser } from './auth/types/supabaseTypes';

export const userService = {
  async signup(formData: AuthFormData): Promise<User> {
    try {
      console.log('Starting signup process...');

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: formData.username,
            full_name: formData.name
          }
        }
      });

      if (authError) {
        console.error('Signup error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      console.log('Auth signup successful, creating profile...');

      // Create profile
      const profile = await profileService.createProfile({
        id: authData.user.id,
        email: formData.email,
        username: formData.username || '',
        full_name: formData.name || '',
        created_at: new Date().toISOString(),
        avatar_url: null,
        is_admin: false
      });

      console.log('Profile created successfully');

      const supabaseUser = authData.user as SupabaseAuthUser;

      // Sign in immediately after signup
      console.log('Attempting auto sign-in...');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Auto sign-in error:', signInError);
        throw signInError;
      }

      console.log('Signup process completed successfully');

      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        username: profile.username,
        is_admin: false,
        email_verified: supabaseUser.email_verified || false
      };
    } catch (error) {
      console.error('Signup process error:', error);
      throw error;
    }
  }
};