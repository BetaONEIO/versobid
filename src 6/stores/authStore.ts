import { create } from 'zustand';
import { supabase, createProfile, getProfile } from '../lib/supabase';
import { Profile } from '../types/database';
import toast from 'react-hot-toast';

interface AuthState {
  user: any;
  profile: Profile | null;
  session: any;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        set({ 
          session, 
          user: session.user,
          profile,
          initialized: true,
          loading: false 
        });
      } else {
        set({ 
          session: null, 
          user: null, 
          profile: null,
          initialized: true,
          loading: false 
        });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await getProfile(session.user.id);
          set({ session, user: session.user, profile });
        } else if (event === 'SIGNED_OUT') {
          set({ session: null, user: null, profile: null });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ initialized: true, loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      const profile = await getProfile(data.user.id);
      set({ 
        user: data.user, 
        session: data.session,
        profile 
      });
      
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, metadata = {}) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            created_at: new Date().toISOString(),
          }
        }
      });
      
      if (error) throw error;

      if (data.user) {
        // Create profile record
        await createProfile(data.user.id, {
          email: data.user.email,
          name: metadata.name,
          roles: metadata.roles,
          items_count: 0,
          successful_deals: 0,
          rating: 5.0
        });

        const profile = await getProfile(data.user.id);
        set({ 
          user: data.user, 
          session: data.session,
          profile 
        });
      }

      toast.success('Account created successfully! Please verify your email.');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, profile: null });
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      await updateProfile(user.id, data);
      const updatedProfile = await getProfile(user.id);
      set({ profile: updatedProfile });

      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
}));