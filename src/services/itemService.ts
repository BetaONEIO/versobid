import { supabase } from '../lib/supabase';
import { Item, ItemFilters } from '../types/item';

export const itemService = {
  async getItems(filters?: ItemFilters): Promise<Item[]> {
    let query = supabase
      .from('items')
      .select(`
        *,
        seller:profiles!seller_id (
          username
        )
      `);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.seller_id) {
      query = query.eq('seller_id', filters.seller_id);
    }
    if (filters?.exclude_seller) {
      query = query.neq('seller_id', filters.exclude_seller);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(item => ({
      ...item,
      seller_username: item.seller?.username
    }));
  },

  async getItem(id: string): Promise<Item | null> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        seller:profiles!seller_id (
          username
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      seller_username: data.seller?.username
    };
  },

  async createItem(item: Omit<Item, 'id' | 'created_at'>): Promise<Item> {
    const { data, error } = await supabase
      .from('items')
      .insert([item])
      .select(`
        *,
        seller:profiles!seller_id (
          username
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create item');

    return {
      ...data,
      seller_username: data.seller?.username
    };
  },

  async deleteListing(itemId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('items')
      .update({ 
        status: 'archived',
        archived_reason: reason,
        archived_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .eq('seller_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
  },

  async checkPendingBids(itemId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bids')
      .select('id')
      .eq('item_id', itemId)
      .eq('status', 'pending')
      .limit(1);

    if (error) throw error;
    return (data?.length || 0) > 0;
  }
};