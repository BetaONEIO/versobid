import { Database } from './database';
import { 
  SupabaseUser,
  SupabaseProfile,
  SupabaseItem,
  SupabaseBid,
  SupabaseChat,
  SupabaseMessage,
  SupabaseReview
} from './supabase';

// Re-export Supabase types
export type {
  SupabaseUser as User,
  SupabaseProfile as Profile,
  SupabaseItem as Item,
  SupabaseBid as Bid,
  SupabaseChat as Chat,
  SupabaseMessage as Message,
  SupabaseReview as Review
};

// Database types
export type Tables = Database['public']['Tables'];
export type DBUser = Tables['profiles']['Row'];
export type DBItem = Tables['items']['Row'];
export type DBBid = Tables['bids']['Row'];
export type DBChat = Tables['chats']['Row'];
export type DBMessage = Tables['messages']['Row'];
export type DBReview = Tables['reviews']['Row'];

// Constants
export const ItemStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export const BidStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export type ItemStatus = typeof ItemStatus[keyof typeof ItemStatus];
export type BidStatus = typeof BidStatus[keyof typeof BidStatus];

// Form Types
export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  target_price: number;
  deadline: string;
  condition: string;
  location: string;
  image_url?: string;
}

export interface BidFormData {
  amount: number;
  notes?: string;
}

export interface ProfileFormData {
  name: string;
  username: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
}