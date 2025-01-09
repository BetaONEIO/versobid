import { supabase } from '../lib/supabase';
import { Item } from '../types/item';

interface ItemFilters {
  category?: string;
  status?: string;
  seller_id?: string;
  exclude_seller?: string;
}

export const itemService = {
  // ... existing methods ...

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