// Extending the base types with Supabase-specific fields
import { Database } from './database';

export type DbUser = Database['public']['Tables']['users']['Row'];
export type DbProfile = Database['public']['Tables']['profiles']['Row'];
export type DbItem = Database['public']['Tables']['items']['Row'];
export type DbBid = Database['public']['Tables']['bids']['Row'];
export type DbChat = Database['public']['Tables']['chats']['Row'];
export type DbMessage = Database['public']['Tables']['messages']['Row'];
export type DbReview = Database['public']['Tables']['reviews']['Row'];

export interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: UserRole;
  };
  profile?: Profile;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  website: string | null;
  rating: number;
  successful_deals: number;
  items_count: number;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  username: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
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
  status: ItemStatus;
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
  notes: string | null;
  status: BidStatus;
  created_at: string;
  updated_at: string;
  seller?: Profile;
  item?: Item;
}

export interface Chat {
  id: string;
  participant1_id: string;
  participant2_id: string;
  item_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  participant?: Profile;
  unread_count: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
  image_url: string | null;
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

export type ItemStatus = 'open' | 'closed';
export type BidStatus = 'pending' | 'accepted' | 'rejected';
export type UserRole = 'buyer' | 'seller' | 'admin';