import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { User } from '../../types';
import toast from 'react-hot-toast';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: any): Promise<User | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to sign up');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    signIn,
    signUp,
    signOut,
  };
}