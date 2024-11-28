export const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Sports',
  'Other',
] as const;

export const CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Any',
] as const;

export const ITEM_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export const BID_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;