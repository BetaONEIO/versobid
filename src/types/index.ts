export * from './auth';
export * from './database';

export type ItemStatus = 'open' | 'closed';
export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  target_price: number;
  deadline: string;
  condition: string;
  location: string;
  image_url: string | null;
  status: ItemStatus;
  buyer_id: string;
  buyer?: Profile;
  bids?: Bid[];
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  item_id: string;
  seller_id: string;
  seller?: Profile;
  amount: number;
  notes: string | null;
  status: BidStatus;
  created_at: string;
  updated_at: string;
  item?: Item;
}