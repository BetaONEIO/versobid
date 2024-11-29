export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: 'buyer' | 'seller' | 'admin';
  };
  profile?: SupabaseProfile;
}

export interface SupabaseProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
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

export interface SupabaseItem {
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
  buyer?: SupabaseProfile;
  bids?: SupabaseBid[];
}

export interface SupabaseBid {
  id: string;
  item_id: string;
  seller_id: string;
  amount: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  seller?: SupabaseProfile;
  item?: SupabaseItem;
}

export interface SupabaseChat {
  id: string;
  participant1_id: string;
  participant2_id: string;
  item_id?: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  participant?: SupabaseProfile;
  unread_count: number;
}

export interface SupabaseMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
  image_url?: string;
}

export interface SupabaseReview {
  id: string;
  user_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: SupabaseProfile;
}