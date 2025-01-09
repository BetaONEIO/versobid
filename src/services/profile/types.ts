import { Database } from '../../types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export interface ProfileService {
  getProfile: (userId: string) => Promise<Profile | null>;
  createProfile: (profile: ProfileInsert) => Promise<Profile>;
  updateProfile: (userId: string, updates: ProfileUpdate) => Promise<Profile>;
}