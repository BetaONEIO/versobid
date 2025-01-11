import { supabase } from '../lib/supabase';
import { Bid, BidStatus } from '../types/bid';

export const bidService = {
  async createBid(itemId: string, amount: number, message?: string): Promise<Bid> {
    const { data, error } = await supabase
      .from('bids')
      .insert([{
        item_id: itemId,
        bidder_id: (await supabase.auth.getUser()).data.user?.id,
        amount,
        message,
        status: 'pending' as BidStatus
      }])
      .select('*, bidder:profiles(username), item:items(title)')
      .single();

    if (error) throw error;
    return data;
  },

  async updateBidStatus(bidId: string, status: BidStatus): Promise<void> {
    const { error } = await supabase
      .from('bids')
      .update({ status })
      .eq('id', bidId);

    if (error) throw error;
  },

  async getBidsForItem(userId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select('*, bidder:profiles(username), item:items(title)')
      .eq('bidder_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getReceivedBids(userId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        bidder:profiles(username),
        item:items!inner(
          title,
          seller_id
        )
      `)
      .eq('item.seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};