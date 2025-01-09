import { User } from '@supabase/supabase-js';

// Base user interface for our application
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  is_admin?: boolean;
  email_verified: boolean;
}

// Type for Supabase user with additional fields
export interface SupabaseAuthUser extends Omit<User, 'confirmed_at'> {
  email_verified?: boolean;
  confirmed_at?: string | null;
}