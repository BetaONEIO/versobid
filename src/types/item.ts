export interface ItemFilters {
  category?: string;
  status?: string;
  seller_id?: string;
  exclude_seller?: string;
}

export type ShippingType = 'shipping' | 'seller-dropoff' | 'seller-pickup';

export interface PickupLocation {
  postcode: string;
  town: string;
  maxDistance?: number;
  address?: string;
}

export interface ShippingOption {
  type: ShippingType;
  cost?: number;
  location?: PickupLocation;
}

export interface ItemFormData {
  title: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  category: string;
  shipping_options: ShippingOption[];
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
}

export interface ItemInsert extends ItemFormData {
  seller_id: string;
  status?: 'active' | 'completed' | 'archived';
}

export interface Item extends ItemInsert {
  id: string;
  created_at: string;
  seller_username?: string;
  archived_reason?: string;
  archived_at?: string;
  bids?: Bid[];
}

// Import the Bid type from bid.ts to avoid duplication
import { Bid } from './bid';