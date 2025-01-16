import { supabase } from '../../lib/supabase';
import { PaymentDetails } from '../../types/payment';

class PaymentService {
  async createPayPalOrder(paymentDetails: PaymentDetails): Promise<{ id: string }> {
    try {
      console.log('Creating PayPal order:', paymentDetails);
      return { id: 'mock-order-id' };
    } catch (error) {
      throw new Error('Failed to create PayPal order');
    }
  }

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
        provider: 'paypal',
        shipping_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
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
        message: 'Payment received for item. Please ship within 7 days to avoid negative rating.',
        data: {
          amount: details.amount,
          currency: details.currency,
          transaction_id: details.transactionId,
          shipping_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }]);
  }

  async checkShippingDeadlines(): Promise<void> {
    const { data: overduePayments, error } = await supabase
      .from('payments')
      .select('*, items(*)')
      .eq('status', 'completed')
      .lt('shipping_deadline', new Date().toISOString())
      .is('shipping_confirmed', false);

    if (error) throw error;

    for (const payment of overduePayments || []) {
      // Apply negative rating to seller
      await supabase.rpc('update_seller_rating', {
        seller_id: payment.seller_id,
        rating_change: -1
      });

      // Create notification for buyer
      await supabase
        .from('notifications')
        .insert([{
          user_id: payment.buyer_id,
          type: 'shipping_overdue',
          message: 'Seller failed to ship item in time. A negative rating has been applied.',
          data: {
            item_id: payment.item_id,
            payment_id: payment.id
          }
        }]);

      // Create notification for seller
      await supabase
        .from('notifications')
        .insert([{
          user_id: payment.seller_id,
          type: 'negative_rating',
          message: 'You received a negative rating for failing to ship item on time.',
          data: {
            item_id: payment.item_id,
            payment_id: payment.id
          }
        }]);
    }
  }

  async confirmShipping(paymentId: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ shipping_confirmed: true })
      .eq('id', paymentId);

    if (error) throw error;
  }
}

export const paymentService = new PaymentService();