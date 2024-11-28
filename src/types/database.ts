export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          username: string
          avatar_url: string | null
          bio: string | null
          company: string | null
          location: string | null
          website: string | null
          rating: number
          successful_deals: number
          items_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          location?: string | null
          website?: string | null
          rating?: number
          successful_deals?: number
          items_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          location?: string | null
          website?: string | null
          rating?: number
          successful_deals?: number
          items_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          target_price: number
          deadline: string
          condition: string
          location: string
          image_url: string | null
          status: 'open' | 'closed'
          buyer_id: string
          created_at: string
          updated_at: string
        }
      }
      bids: {
        Row: {
          id: string
          item_id: string
          seller_id: string
          amount: number
          notes: string | null
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
      }
      chats: {
        Row: {
          id: string
          participant1_id: string
          participant2_id: string
          item_id: string | null
          last_message: string | null
          last_message_at: string | null
          created_at: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          recipient_id: string
          content: string
          created_at: string
          read: boolean
          image_url: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          reviewer_id: string
          rating: number
          comment: string
          created_at: string
        }
      }
    }
  }
}