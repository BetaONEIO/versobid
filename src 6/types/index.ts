export interface User {
  id: string;
  email: string;
  profile?: Profile;
  user_metadata?: {
    role: 'buyer' | 'seller' | 'admin';
    name: string;
  };
}

export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  email: string;
  username: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  rating: number;
  successful_deals: number;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  chat_id: string;
  created_at: string;
  read: boolean;
  image_url?: string;
}

export interface Chat {
  id: string;
  participant1_id: string;
  participant2_id: string;
  item_id?: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  participant?: Profile;
  unread_count: number;
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
  image_url?: string;
  status: 'open' | 'closed';
  buyer_id: string;
  created_at: string;
  updated_at: string;
  buyer?: Profile;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  item_id: string;
  seller_id: string;
  amount: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  seller?: Profile;
  item?: Item;
}

export interface Review {
  id: string;
  user_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: Profile;
}