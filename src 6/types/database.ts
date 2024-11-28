export interface Profile {
  id: string;
  email: string;
  username: string;
  name: string;
  roles: string[];
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  company: string | null;
  location: string | null;
  items_count: number;
  successful_deals: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

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
  status: 'open' | 'closed';
  buyer_id: string;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  item_id: string;
  seller_id: string;
  amount: number;
  notes: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}