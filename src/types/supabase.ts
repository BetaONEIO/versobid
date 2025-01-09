export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          email: string;
          is_admin: boolean;
        };
        Insert: {
          id: string;
          created_at?: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          email: string;
          is_admin?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          email?: string;
          is_admin?: boolean;
        };
      };
      items: {
        Row: {
          id: string;
          title: string;
          description: string;
          min_price: number;
          max_price: number;
          seller_id: string;
          category: string;
          shipping_options: any[];
          condition: string | null;
          status: 'active' | 'completed' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          min_price: number;
          max_price: number;
          seller_id: string;
          category: string;
          shipping_options?: any[];
          condition?: string;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          min_price?: number;
          max_price?: number;
          seller_id?: string;
          category?: string;
          shipping_options?: any[];
          condition?: string;
          status?: 'active' | 'completed' | 'archived';
          created_at?: string;
        };
      };
      bids: {
        Row: {
          id: string;
          item_id: string;
          bidder_id: string;
          amount: number;
          message: string | null;
          shipping_option: string;
          status: 'pending' | 'accepted' | 'rejected' | 'countered';
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          bidder_id: string;
          amount: number;
          message?: string;
          shipping_option: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'countered';
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          bidder_id?: string;
          amount?: number;
          message?: string;
          shipping_option?: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'countered';
          created_at?: string;
        };
      };
    };
  };
}