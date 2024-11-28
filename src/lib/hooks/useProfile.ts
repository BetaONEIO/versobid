```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Profile } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (userId || user?.id) {
      fetchProfile(userId || user.id);
    }
  }, [userId, user]);

  const fetchProfile = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await fetchProfile(user.id);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refreshProfile: () => user?.id && fetchProfile(user.id),
  };
}
```