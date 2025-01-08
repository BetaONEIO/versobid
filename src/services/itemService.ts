import { supabase } from '../lib/supabase';
import { Item } from '../types/item';

interface ItemFilters {
  category?: string;
  status?: string;
  seller_id?: string;
  exclude_seller?: string;
}

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

    return data.map(item => ({
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
    return {
      ...data,
      seller_username: data.seller?.username
    };
  }
};