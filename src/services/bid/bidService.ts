import { supabase } from '../../lib/supabase';
import { Bid, BidStatus } from '../../types/bid';

export const bidService = {
  async createBid(bid: Partial<Bid>): Promise<Bid> {
    const { data, error } = await supabase
      .from('bids')
      .insert([{
        ...bid,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Notify seller
    const { data: item } = await supabase
      .from('items')
      .select('title, seller_id')
      .eq('id', bid.item_id)
      .single();

    if (item) {
      const { data: seller } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', item.seller_id)
        .single();

      if (seller) {
        try {
          await supabase.rpc('notify_seller', {
            seller_email: seller.email,
            item_title: item.title,
            bid_amount: bid.amount!,
            item_link: `${window.location.origin}/items/${bid.item_id}`
          });
        } catch (emailError) {
          console.error('Failed to send bid notification email:', emailError);
        }
      }
    }

    return data;
  },

  async updateBidStatus(bidId: string, status: BidStatus): Promise<void> {
    const { error } = await supabase
      .from('bids')
      .update({ status })
      .eq('id', bidId);

    if (error) throw error;
  }
};