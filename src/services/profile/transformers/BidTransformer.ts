import { BaseTransformer } from '.';
import { Bid } from '../../../types/bid';
import { Database } from '../../../types/supabase';

type BidRow = Database['public']['Tables']['bids']['Row'];

export class BidTransformer extends BaseTransformer<BidRow, Bid> {
  transform(data: BidRow): Bid {
    return {
      id: data.id,
      itemId: data.item_id,
      sellerId: data.bidder_id,
      amount: data.amount,
      message: data.message || '',
      shippingOption: data.shipping_option,
      status: data.status,
      createdAt: data.created_at
    };
  }
}