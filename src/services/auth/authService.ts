import { supabase } from '../../lib/supabase';
import { AuthService, AuthFormData } from './types';
import { AuthUser, SupabaseAuthUser } from './types/user';
import { profileService } from '../profile/profileService';
import { mapUserFromProfile } from './mappers/userMapper';
import { emailService } from '../email/emailService';

export const authService: AuthService = {
  async signup(formData: AuthFormData): Promise<AuthUser> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user account');

    const profile = await profileService.createProfile({
      id: authData.user.id,
      email: formData.email,
      username: formData.username || '',
      full_name: formData.name || '',
      created_at: new Date().toISOString(),
      avatar_url: null,
    });

    try {
      await emailService.sendEmail({
        to: formData.email,
        subject: 'Welcome to VersoBid!',
        templateName: 'welcome',
        params: {
          name: formData.name || formData.username || '',
          confirmation_link: `${window.location.origin}/confirm-email`
        }
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    const supabaseUser = authData.user as SupabaseAuthUser;
    return mapUserFromProfile(profile, supabaseUser);
  },

  async login(identifier: string, password: string): Promise<AuthUser> {
    let email = identifier;
    if (!identifier.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();
      
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
    return mapUserFromProfile(profile, supabaseUser);
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};