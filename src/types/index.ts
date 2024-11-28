import { Database } from './database';

// Utility types to extract row types from Database
type Tables = Database['public']['Tables'];
type Row<T extends keyof Tables> = Tables[T]['Row'];

// Base types from database schema
export type DBUser = Row<'profiles'>;
export type DBItem = Row<'items'>;
export type DBBid = Row<'bids'>;
export type DBChat = Row<'chats'>;
export type DBMessage = Row<'messages'>;
export type DBReview = Row<'reviews'>;

// Enhanced types with relationships
export interface User extends DBUser {
  role?: 'buyer' | 'seller' | 'admin';
}

export interface Item extends DBItem {
  buyer?: User;
  bids?: Bid[];
}

export interface Bid extends DBBid {
  seller?: User;
  item?: Item;
}

export interface Chat extends DBChat {
  participant?: User;
  messages?: Message[];
  unread_count?: number;
}

export interface Message extends DBMessage {
  sender?: User;
  recipient?: User;
}

export interface Review extends DBReview {
  reviewer?: User;
  reviewee?: User;
}

// Form data types
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