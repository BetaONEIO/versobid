export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'bid_received' | 'bid_accepted';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  user_id: string;
  created_at: string;
  data?: Record<string, any>;
}