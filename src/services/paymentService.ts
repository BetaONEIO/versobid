import { supabase } from '../lib/supabase';

export interface PaymentDetails {
  amount: number;
  currency: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  transactionId: string;
}

export const paymentService = {
  async recordPayment(details: PaymentDetails): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .insert([{
        amount: details.amount,
        currency: details.currency,
        item_id: details.itemId,
        buyer_id: details.buyerId,
        seller_id: details.sellerId,
        transaction_id: details.transactionId,
        status: 'completed',
        provider: 'paypal'
      }]);

    if (error) throw error;

    // Update item status
    await supabase
      .from('items')
      .update({ status: 'completed' })
      .eq('id', details.itemId);

    // Create notification for seller
    await supabase
      .from('notifications')
      .insert([{
        user_id: details.sellerId,
        type: 'payment_received',
        message: `Payment received for item`,
        data: {
          amount: details.amount,
          currency: details.currency,
          transaction_id: details.transactionId
        }
      }]);
  }
};