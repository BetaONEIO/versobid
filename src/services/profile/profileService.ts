import { supabase } from '../../lib/supabase';
import { ProfileService, Profile, ProfileInsert, ProfileUpdate } from './types';
import { validateProfileData } from './validators';
import { sanitizeProfile } from './utils';
import { PROFILE_ERRORS } from './constants';
import { ProfileError, ProfileValidationError, ProfileNotFoundError } from './errors';

export const profileService: ProfileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw new ProfileError(error.message);
      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },

  async createProfile(profile: ProfileInsert): Promise<Profile> {
    try {
      const sanitizedProfile = sanitizeProfile(profile);
      const errors = validateProfileData(sanitizedProfile as ProfileInsert);
      
      if (errors.length > 0) {
        throw new ProfileValidationError(errors.join(', '));
      }

      // Check for existing email/username
      const { data: existing } = await supabase
        .rpc('check_user_exists', {
          check_email: sanitizedProfile.email,
          check_username: sanitizedProfile.username
        });

      if (existing?.[0]?.exists_email) {
        throw new ProfileValidationError(PROFILE_ERRORS.DUPLICATE_EMAIL);
      }

      if (existing?.[0]?.exists_username) {
        throw new ProfileValidationError(PROFILE_ERRORS.DUPLICATE_USERNAME);
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...sanitizedProfile,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw new ProfileError(error.message);
      if (!data) throw new ProfileError(PROFILE_ERRORS.CREATION_FAILED);

      return data;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    try {
      const sanitizedUpdates = sanitizeProfile(updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new ProfileError(error.message);
      if (!data) throw new ProfileNotFoundError(userId);

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }
};