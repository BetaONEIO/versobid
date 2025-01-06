import { supabase } from '../lib/supabase';
import { AuthFormData, User } from '../types';
import { profileService } from './profileService';
import { SupabaseAuthUser } from './auth/types/supabaseTypes';

export const userService = {
  signup: async (formData: AuthFormData): Promise<User> => {
    // Check if email exists
    const { data: existingEmail, error: emailError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', formData.email)
      .maybeSingle();

    if (emailError) throw emailError;
    if (existingEmail) {
      throw new Error('Email already registered');
    }

    // Check if username exists
    const { data: existingUsername, error: usernameError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', formData.username)
      .maybeSingle();

    if (usernameError) throw usernameError;
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user account');

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

    const supabaseUser = authData.user as SupabaseAuthUser;

    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      username: profile.username,
      is_admin: false,
      email_verified: supabaseUser.email_verified || false
    };
  },

  login: async (identifier: string, password: string): Promise<User> => {
    let email = identifier;
    if (!identifier.includes('@')) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', identifier)
        .maybeSingle();
      
      if (profileError) throw profileError;
      if (!profile) throw new Error('User not found');
      email = profile.email;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error('Invalid credentials');
    if (!authData.user) throw new Error('User not found');

    const profile = await profileService.getProfile(authData.user.id);
    if (!profile) throw new Error('Profile not found');

    const supabaseUser = authData.user as SupabaseAuthUser;

    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      username: profile.username,
      is_admin: profile.is_admin || false,
      email_verified: supabaseUser.email_verified || false
    };
  }
};