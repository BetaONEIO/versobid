import { supabase } from '../lib/supabase';
import { User } from '../types/user';

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .rpc('manage_user', {
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        target_user_id: userId,
        action: 'delete'
      });

    if (error) throw error;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const { error } = await supabase
      .rpc('manage_user', {
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        target_user_id: userId,
        action: 'update',
        updates
      });

    if (error) throw error;
  },

  async setAdminStatus(userId: string, isAdmin: boolean): Promise<void> {
    const { error } = await supabase
      .rpc('manage_admin_status', {
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        target_user_id: userId,
        make_admin: isAdmin
      });

    if (error) throw error;
  },

  async getActivityLog(): Promise<any[]> {
    const { data, error } = await supabase
      .from('admin_activity_log')
      .select(`
        *,
        admin:profiles!admin_id(username)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};