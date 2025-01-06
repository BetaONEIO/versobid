import { supabase } from '../lib/supabase';
import { Item, ItemFormData } from '../types/item';

interface ItemFilters {
  category?: string;
  status?: string;
  seller_id?: string;
}

export const itemService = {
  async getItems(filters?: ItemFilters): Promise<Item[]> {
    let query = supabase.from('items').select('*');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.seller_id) {
      query = query.eq('seller_id', filters.seller_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getItem(id: string): Promise<Item | null> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createItem(item: ItemFormData & { seller_id: string; status: string }): Promise<Item> {
    const { data, error } = await supabase
      .from('items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};