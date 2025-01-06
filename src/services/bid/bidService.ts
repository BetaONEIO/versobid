import { supabase } from '../../lib/supabase';
import { Bid, BidStatus } from '../../types/bid';
import { emailService } from '../email/emailService';

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
      .eq('id', bid.itemId)
      .single();

    if (item) {
      const { data: seller } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', item.seller_id)
        .single();

      if (seller) {
        try {
          await emailService.sendEmail({
            to: seller.email,
            subject: 'New Bid Received',
            templateName: 'new-bid',
            params: {
              item_title: item.title,
              bid_amount: bid.amount!,
              item_link: `${window.location.origin}/items/${bid.itemId}`
            }
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

    if (status === 'accepted') {
      // Get bid details
      const { data: bid } = await supabase
        .from('bids')
        .select('*, items(*), profiles(*)')
        .eq('id', bidId)
        .single();

      if (bid) {
        try {
          await emailService.sendEmail({
            to: bid.profiles.email,
            subject: 'Your Bid Was Accepted!',
            templateName: 'bid-accepted',
            params: {
              item_title: bid.items.title,
              bid_amount: bid.amount,
              seller_name: bid.items.seller_name,
              payment_link: `/payment/${bidId}`
            }
          });
        } catch (emailError) {
          console.error('Failed to send bid accepted email:', emailError);
        }
      }
    }
  }
};